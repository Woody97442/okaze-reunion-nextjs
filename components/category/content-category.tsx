"use client";

import CardPost from "@/components/post/card-post";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FilterPosts, SortPosts } from "@/lib/filter-posts";
import { Category } from "@/prisma/category/types";
import { Post } from "@/prisma/post/types";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { HiMenuAlt1, HiMenuAlt2 } from "react-icons/hi";

interface Props {
  category: Category;
  posts: Post[];
  listAttributs: string[];
}

export default function ContentCategory({
  category,
  posts,
  listAttributs,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");

  const [selectedAttribute, setSelectedAttribute] = useState<string>("default");

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const [orderBy, setOrderBy] = useState<string>("recent");

  const [listState, setListState] = useState<string[]>([]);

  // Functions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(currentSearch);
    }
  };

  const handleSetListState = (value: string) => {
    if (listState.includes(value)) {
      setListState(listState.filter((item) => item !== value));
    } else {
      setListState([...listState, value]);
    }
  };

  const postsSorted = SortPosts(posts, orderBy);

  const filteredPosts = postsSorted.filter((post) =>
    FilterPosts(
      post,
      searchTerm,
      selectedAttribute,
      minPrice,
      maxPrice,
      listState
    )
  );

  return (
    <div className="flex flex-col md:flex-row md:space-x-6 h-full ">
      <aside className="flex-col gap-y-4 bg-white w-1/3 py-4 px-8 shadow-md rounded-sm hidden md:flex">
        <div className="space-y-4 my-2">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={currentSearch}
              onChange={(e) => {
                setCurrentSearch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="submit"
              variant={"default"}
              onClick={() => setSearchTerm(currentSearch)}>
              <FiSearch className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
        <Separator />
        {listAttributs ? (
          <>
            <div className="space-y-4 my-2">
              <h3 className="text-lg">Attribut</h3>
              <Select
                onValueChange={(value) => setSelectedAttribute(value)}
                defaultValue={"default"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"default"}>Tous Afficher</SelectItem>
                    {listAttributs.map((attribute, index) => (
                      <SelectItem
                        key={index}
                        value={attribute}>
                        {attribute}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Separator />
          </>
        ) : (
          <></>
        )}
        <div className="space-y-4 my-2">
          <h3 className="text-lg">Prix</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Minimum"
              onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
              inputMode="numeric"
            />
            <Input
              type="number"
              placeholder="Maximum"
              onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
              inputMode="numeric"
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4 my-2">
          <h3 className="text-lg">État</h3>
          <div className="items-top flex space-x-2 justify-between items-center">
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="new"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                État neuf
              </label>
            </div>
            <Checkbox
              id="new"
              className="h-6 w-6 "
              onClick={() => handleSetListState("new")}
            />
          </div>
          <div className="items-top flex space-x-2 justify-between items-center">
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="very_good"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Très bon
              </label>
            </div>
            <Checkbox
              id="very_good"
              className="h-6 w-6 "
              onClick={() => handleSetListState("very_good")}
            />
          </div>
          <div className="items-top flex space-x-2 justify-between items-center">
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="good"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Bon
              </label>
            </div>
            <Checkbox
              id="good"
              className="h-6 w-6 "
              onClick={() => handleSetListState("good")}
            />
          </div>
          <div className="items-top flex space-x-2 justify-between items-center">
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="satisfactory"
                className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                État satisfaisant
              </label>
            </div>
            <Checkbox
              id="satisfactory"
              className="h-6 w-6 "
              onClick={() => handleSetListState("satisfactory")}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4 my-2">
          <h3 className="text-lg">Tri</h3>
          <RadioGroup
            defaultValue="recent"
            className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="r2">Plus récents</Label>
              <RadioGroupItem
                value="recent"
                id="r1"
                className="w-6 h-6"
                onClick={() => setOrderBy("recent")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="r3">Plus anciennes</Label>
              <RadioGroupItem
                value="oldest"
                id="r3"
                className="w-6 h-6"
                onClick={() => setOrderBy("oldest")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="r3">Prix croissant</Label>
              <RadioGroupItem
                value="priceLow"
                id="r4"
                className="w-6 h-6"
                onClick={() => setOrderBy("priceLow")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="r3">Prix décroissant</Label>
              <RadioGroupItem
                value="priceHigh"
                id="r5"
                className="w-6 h-6"
                onClick={() => setOrderBy("priceHigh")}
              />
            </div>
          </RadioGroup>
        </div>
      </aside>
      <div className="grid gap-2 md:hidden">
        <Sheet key="left">
          <SheetTrigger
            asChild
            className="w-full">
            <div className="bg-secondary rounded-md py-2 w-full flex flex-row justify-center text-white gap-4">
              <HiMenuAlt1 className="w-6 h-6 text-white" />
              <span className="font-Lato font-bold">FILTRES</span>
            </div>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-auto">
            <SheetHeader>
              <SheetTitle className="font-Lato mb-4">
                <div>
                  <span>Filtres</span>
                  <Separator />
                </div>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-screen w-full rounded-md ">
              <div className="gap-y-6 items-center ">
                {listAttributs ? (
                  <div className="space-y-4 my-2">
                    <h3 className="text-2xl font-bold font-Lato">Attribut</h3>
                    <Select
                      onValueChange={(value) => setSelectedAttribute(value)}
                      defaultValue={"default"}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={"default"}>
                            Tous Afficher
                          </SelectItem>
                          {listAttributs.map((attribute, index) => (
                            <SelectItem
                              key={index}
                              value={attribute}>
                              {attribute}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <Separator />
              <div className="space-y-4 my-2">
                <h3 className="text-2xl font-bold font-Lato">Prix</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Minimum"
                    onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                    inputMode="numeric"
                  />
                  <Input
                    type="number"
                    placeholder="Maximum"
                    onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                    inputMode="numeric"
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4 my-2">
                <h3 className="text-2xl font-bold font-Lato">État</h3>
                <div className="items-top flex space-x-2 justify-between items-center">
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="new"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      État neuf
                    </label>
                  </div>
                  <Checkbox
                    id="new"
                    className="h-6 w-6 "
                    onClick={() => handleSetListState("new")}
                  />
                </div>
                <div className="items-top flex space-x-2 justify-between items-center">
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="very_good"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Très bon
                    </label>
                  </div>
                  <Checkbox
                    id="very_good"
                    className="h-6 w-6 "
                    onClick={() => handleSetListState("very_good")}
                  />
                </div>
                <div className="items-top flex space-x-2 justify-between items-center">
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="good"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Bon
                    </label>
                  </div>
                  <Checkbox
                    id="good"
                    className="h-6 w-6 "
                    onClick={() => handleSetListState("good")}
                  />
                </div>
                <div className="items-top flex space-x-2 justify-between items-center">
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="satisfactory"
                      className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      État satisfaisant
                    </label>
                  </div>
                  <Checkbox
                    id="satisfactory"
                    className="h-6 w-6 "
                    onClick={() => handleSetListState("satisfactory")}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4 my-2">
                <h3 className="text-2xl font-bold font-Lato">Tri</h3>
                <RadioGroup
                  defaultValue="recent"
                  className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="r2">Plus récents</Label>
                    <RadioGroupItem
                      value="recent"
                      id="r1"
                      className="w-6 h-6"
                      onClick={() => setOrderBy("recent")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="r3">Plus anciennes</Label>
                    <RadioGroupItem
                      value="oldest"
                      id="r3"
                      className="w-6 h-6"
                      onClick={() => setOrderBy("oldest")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="r3">Prix croissant</Label>
                    <RadioGroupItem
                      value="priceLow"
                      id="r4"
                      className="w-6 h-6"
                      onClick={() => setOrderBy("priceLow")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="r3">Prix décroissant</Label>
                    <RadioGroupItem
                      value="priceHigh"
                      id="r5"
                      className="w-6 h-6"
                      onClick={() => setOrderBy("priceHigh")}
                    />
                  </div>
                </RadioGroup>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="space-y-4 my-2">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={currentSearch}
              onChange={(e) => {
                setCurrentSearch(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className="bg-white"
            />
            <Button
              type="submit"
              variant={"default"}
              onClick={() => setSearchTerm(currentSearch)}>
              <FiSearch className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
      <section className="flex flex-col gap-y-4 bg-white w-full py-4 px-8 shadow-md rounded-sm">
        <>
          {!posts || posts.length === 0 ? (
            <h1 className="text-2xl text-black font-bold font-Lato">
              Aucun article Disponible pour le moment
            </h1>
          ) : (
            <>
              <div className="space-y-4 my-2">
                <h2 className="text-2xl text-black font-bold font-Lato">
                  {category?.name}
                </h2>
              </div>
              <Separator />
              <div className="h-full justify-between flex flex-col">
                <ScrollArea className="h-full md:h-[650px] w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`space-y-4 my-2 animate-fadeIn`}
                        style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardPost post={post} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}
        </>
      </section>
    </div>
  );
}
