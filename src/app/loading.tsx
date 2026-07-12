/**
 * 全局路由加载态
 * 页面切换时展示骨架屏
 */
export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-5 pt-6 pb-3">
        <div className="skeleton h-8 w-28 rounded" />
      </div>
      <div className="flex-1 px-5 py-4 space-y-4">
        <div className="card space-y-3">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
        </div>
        <div className="card space-y-3">
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-3/4" />
        </div>
      </div>
    </div>
  );
}
