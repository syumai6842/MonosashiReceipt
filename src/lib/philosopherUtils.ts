// 英語名 → 日本語名の対応表
const philosopherNameMap: Record<string, string> = {
  Aristotle: "アリストテレス",
  Nietzsche: "ニーチェ",
  Kant: "カント",
  Rousseau: "ルソー",
  Plato: "プラトン",
  Confucius: "孔子",
  Bergson: "ベルクソン",
  Camus: "カミュ",
  Kierkegaard: "キルケゴール",
  Socrates: "ソクラテス",
  Emerson: "エマーソン",
  Dewey: "デューイ",
  Epicurus: "エピクロス",
  Mill: "ミル",
  Sartre: "サルトル",
  Seneca: "セネカ",
  Hobbes: "ホッブズ",
  Locke: "ロック",
  Levinas: "レヴィナス",
  "Marcus Aurelius": "マルクス・アウレリウス", // ← 修正！
  "Saint Augustine": "アウグスティヌス",        // ← 修正！
  Fromm: "フロム",
  Bentham: "ベンサム",
};

// 哲学者の説明（キーは必ず文字列に！）
const philosopherDescriptionMap: Record<string, string> = {
  "アリストテレス": "論理学・倫理学の基礎を築いた古代ギリシャの哲学者",
  "ニーチェ": "「神は死んだ」で知られる、価値の再構築を説いた哲学者",
  "カント": "理性による道徳法則を唱えたドイツ観念論の代表者",
  "ルソー": "『社会契約論』で知られる近代民主主義の思想家",
  "プラトン": "理想の世界（イデア論）を説いた古代ギリシャの哲学者",
  "孔子": "仁と礼を重んじた東洋思想の祖",
  "ベルクソン": "「生命の躍動」を重視したフランスの哲学者",
  "カミュ": "不条理と生の意味を探求した哲学的作家",
  "キルケゴール": "個人の信仰と選択の重要性を説いた実存主義の先駆者",
  "ソクラテス": "「無知の知」で知られる対話の哲学者",
  "エマーソン": "個人の直観と自然との一体性を重視したアメリカの超越主義者",
  "デューイ": "教育哲学と実用主義の発展に寄与した哲学者",
  "エピクロス": "快楽主義を唱えた古代ギリシャの哲学者",
  "ミル": "自由と功利主義の両立を模索したイギリスの思想家",
  "サルトル": "「実存は本質に先立つ」を唱えたフランスの哲学者",
  "セネカ": "ストア派の代表であり、理性による心の平静を重んじた",
  "ホッブズ": "『リヴァイアサン』で社会契約論を展開した政治思想家",
  "ロック": "近代経験論の祖であり、自由主義思想の基礎を築いた",
  "レヴィナス": "「他者への責任」を哲学の中心に据えた思想家",
  "マルクス・アウレリウス": "ローマ皇帝でありストア哲学者であり、『自省録』の著者",
  "アウグスティヌス": "キリスト教思想と古代哲学を統合した神学者",
  "フロム": "愛と自由を心理学的に探求した社会哲学者",
  "ベンサム": "功利主義を体系化したイギリスの法哲学者",
};




// src/lib/philosopherUtils.ts

type ValueData = {
  id: string;
  label: string;
  philosophers: string[];
};

// public/data/values.json を読み込む
import data from "@/../public/data/values.json";

// 選ばれたキーワード（label）から哲学者をカウントする関数
export function countPhilosophers(words: string[]) {
  const allData = data as ValueData[];

  const counts: Record<string, number> = {};

  // 選ばれたキーワードごとに哲学者を集計
  for (const w of words) {
    const item = allData.find((d) => d.label === w);
    if (item) {
      for (const name of item.philosophers) {
        counts[name] = (counts[name] || 0) + 1;
      }
    }
  }

    return Object.entries(counts)
  .map(([name, count]) => {
    const jpName = philosopherNameMap[name] || name; // 英→日
    return {
      name: jpName,
      count,
      description: philosopherDescriptionMap[jpName] || "説明がありません。",
    };
  })
  .sort((a, b) => b.count - a.count);

}