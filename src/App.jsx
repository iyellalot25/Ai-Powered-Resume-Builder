import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 max-w-3xl mx-auto">
      <Header
        name="Srijan Ghosh"
        title="AI/ML Developer"
        email="srijan@email.com"
        location="India"
      />
    </div>
  );
}

export default App;
