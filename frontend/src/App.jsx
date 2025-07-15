import Card from "@/components/Card.jsx";

export default function App() {
  return (
    <>
      <h1 className="text-5xl font-bold mb-16">Proyecto de UTU</h1>
      <Card
        title="Chajaja"
        description="Carne de cerdo marinada lentamente en achiote y especias, servida en tortillas de maíz con cebolla morada y habanero."
      />
      <Card
        title="Pizza Artesanal 'Cuatro Quesos'"
        description="Una irresistible combinación de quesos mozzarella, provolone, parmesano y gorgonzola sobre una masa crujiente, hecha a mano."
      />
    </>
  );
}
