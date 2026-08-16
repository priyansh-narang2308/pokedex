import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { PokemonDetail } from "@/hooks/usePokemonDetail";
import { PokemonDetailView } from "@/components/pokemon/pokemon-detail-view";

async function getPokemon(name: string) {
  try {
    return await fetchApi<PokemonDetail>(`/pokemon/${name.toLowerCase()}`);
  } catch {
    return null;
  }
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const pokemon = await getPokemon(resolvedParams.name);

  if (!pokemon) {
    notFound();
  }

  return <PokemonDetailView pokemon={pokemon} />;
}
