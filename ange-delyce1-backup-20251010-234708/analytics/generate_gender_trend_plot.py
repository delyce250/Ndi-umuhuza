from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "stunting-under-five_rows.csv"
OUTPUT_DIR = ROOT / "analytics" / "outputs"
OUTPUT_PATH = OUTPUT_DIR / "stunting_gender_trend.png"


def load_and_prepare() -> pd.DataFrame:
  """Load CSV data and pivot to female/male/total columns."""
  df = pd.read_csv(DATA_PATH)
  df = df[df["INDICATOR"] == "Stunting in children (under 5)"]
  pivoted = (
    df.pivot_table(
      index="YEAR",
      columns="SEX",
      values="RATE_PER_100"
    )
    .reset_index()
    .rename(columns=str.lower)
  )
  pivoted = pivoted.rename(columns={"year": "Year", "female": "Female", "male": "Male", "total": "Total"})
  return pivoted


def plot_gender_trend(df: pd.DataFrame) -> None:
  sns.set_theme(style="whitegrid")
  plt.figure(figsize=(12, 6))

  plt.plot(df["Year"], df["Male"], label="Male", color="#2563EB", linewidth=2.5)
  plt.plot(df["Year"], df["Female"], label="Female", color="#D946EF", linewidth=2.5)
  plt.plot(df["Year"], df["Total"], label="Total", color="#16A34A", linewidth=2.5)
  plt.fill_between(df["Year"], df["Total"], color="#16A34A", alpha=0.15)

  plt.title("Stunting (Under Five) Rates by Gender (2000-2024)", fontsize=16, color="#40531A")
  plt.xlabel("Year")
  plt.ylabel("Rate per 100 Children")
  plt.ylim(25, 55)
  plt.legend(frameon=False, loc="upper right")
  plt.tight_layout()

  OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
  plt.savefig(OUTPUT_PATH, dpi=300)
  plt.close()


def main():
  df = load_and_prepare()
  plot_gender_trend(df)
  print(f"Plot saved to {OUTPUT_PATH}")


if __name__ == "__main__":
  main()

