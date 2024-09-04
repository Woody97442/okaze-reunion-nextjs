import DashboardContent from "./dashboard-content";

const DashboardPage = async () => {
  return (
    <main className="flex flex-col py-8 space-y-6 container mt-[17rem] md:mt-[13rem]">
      <DashboardContent />
    </main>
  );
};

export default DashboardPage;
