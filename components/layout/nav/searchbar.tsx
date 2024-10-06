"use client";
import { GetPostsForSearchBar } from "@/actions/admin/post";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormatPrice } from "@/lib/format-price";
import { Post } from "@/prisma/post/types";
import Link from "next/link";
import { useState, useTransition, useRef } from "react";
import { FiSearch } from "react-icons/fi";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showResults, setShowResults] = useState(false);

  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (query && query.length > 3) {
      startTransition(() => {
        setLoading(true);
        GetPostsForSearchBar(query).then((data) => {
          setResults(data);
          setLoading(false);
          setShowResults(true);
        });
      });
    } else {
      setShowResults(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Vérifie si le focus est en dehors de la barre de recherche et des résultats
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(e.relatedTarget as Node)
    ) {
      setShowResults(false);
    }
  };

  return (
    <div
      className="flex flex-col w-full max-w-sm items-center space-x-2 relative"
      ref={searchBarRef}
      onBlur={handleBlur}
      tabIndex={-1}>
      <div className="flex items-center space-x-2 w-full">
        <Input
          type="text"
          placeholder="Rechercher..."
          className="font-Lato"
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button
          type="submit"
          variant={"default"}>
          <FiSearch
            className="w-6 h-6 text-white"
            onClick={handleSearch}
          />
        </Button>
      </div>

      <div className="w-full absolute top-11 shadow-md z-50">
        {/* Box des résultats */}
        {!loading && results.length > 0 && showResults && (
          <div className="mt-2 p-4 bg-white rounded-md shadow-md">
            <ul className="flex flex-col space-y-4">
              {results.map((result: Post) => (
                <li
                  key={result.id}
                  className="py-1 border-b last:border-b-0">
                  <Link
                    className="w-full h-auto justify-start space-x-9 bg-white"
                    href={`/post/${result.id}`}
                    onClick={() => {
                      setResults([]);
                      setQuery("");
                      setShowResults(false); // Cache les résultats quand un lien est cliqué
                    }}>
                    <div className="cursor-pointer flex flex-row space-x-6 items-center hover:bg-gray-200 rounded-md">
                      <Avatar className="h-[60px] w-[60px]">
                        <AvatarImage
                          src={
                            result.images[0]?.src ||
                            "/images/image_not_found_2.jpg"
                          }
                        />
                      </Avatar>
                      <div>
                        <div className="flex flex-row space-x-2">
                          <span className="text-sm font-bold">
                            {result.title}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-bold">Prix : </span>
                          <span>{FormatPrice(result.price)}€</span>
                        </div>
                        <div>
                          <span className="text-sm font-bold">
                            Catégorie :{" "}
                          </span>
                          <span>{result.categories[0].name}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Message de chargement */}
        {loading && (
          <div className="mt-2 p-4 bg-white rounded-md shadow-md">
            Recherche en cours...
          </div>
        )}
      </div>
    </div>
  );
};
