export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center my-8 mt-[17rem] md:mt-[13rem]">
      {children}
    </div>
  );
}
