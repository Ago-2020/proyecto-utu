export default function Card({ title, description }) {
  return (
    <div className="border p-5 bg-red-500/20">
      <h3 className="text-2xl font-bold pb-2">{title}</h3>
      <p className="pb-4">{description}</p>
      <button className="btn btn-neutral">Example Button</button>
    </div>
  );
}
