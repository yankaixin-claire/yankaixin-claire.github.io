import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 text-center">
      <span className="text-6xl mb-4">🔮</span>
      <h1 className="text-xl font-bold text-gray-700 mb-2">卦象未寻</h1>
      <p className="text-gray-400 text-sm mb-6">此页面已遁入虚空，不在六十四卦之中</p>
      <Link href="/" className="btn-primary">
        返回首页
      </Link>
    </div>
  );
}
