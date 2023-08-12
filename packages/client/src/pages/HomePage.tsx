const HomePage = () => {
  return (
    <>
      <p className="flex flex-row gap-2">
        Home page yarn?
        <a
          href="/login"
          className="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline"
        >
          Log in
        </a>
      </p>
    </>
  );
};

export default HomePage;
