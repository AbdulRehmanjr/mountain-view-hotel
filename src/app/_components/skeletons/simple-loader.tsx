export const SimpleLoader = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="space-y-6 text-center">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-red-500"></div>
        </div>
      </div>
    </div>
  );
};
