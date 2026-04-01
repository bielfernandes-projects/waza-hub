import { BELTS } from '@/data/mockData';
import { BeltListItem } from '@/components/BeltListItem';

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="p-8 border-b-2 border-black bg-neutral-100">
        <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">
          O Caminho <br/> Suave
        </h2>
        <p className="font-bold text-xl opacity-70">
          Acompanhe sua evolução e domine as técnicas do currículo.
        </p>
      </div>

      <div className="flex flex-col">
        {BELTS.map(belt => (
          <BeltListItem key={belt.id} belt={belt} />
        ))}
      </div>
    </div>
  );
}
