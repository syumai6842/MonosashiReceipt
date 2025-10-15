import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#4b3f3f] text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">価値観レシート</h1>
        <p className="text-lg mb-8 text-white/90 leading-relaxed">
          価値観を表すカードを配られ、その中から4つだけを残して他を捨てていくゲームです。<br />
          最後に残った4つの価値観から、あなたの哲学者の顔が生成されます。
        </p>
        <div className="space-y-4">
          <Link
            href="/game"
            className="block w-full rounded-xl bg-white text-black px-6 py-4 font-bold text-lg hover:bg-white/90 transition-colors"
          >
            ゲームを始める
          </Link>
          <p className="text-sm text-white/70">
            15枚の価値観カードから4つを選んで、あなただけの哲学者を見つけましょう
          </p>
        </div>
      </div>
    </div>
  );
}
