import { SearchBar } from "@/components/category/searchbar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LeftColumn = () => {
  //TODO: Implementation of left column filter

  return (
    <>
      <div className="space-y-4 my-2">
        <SearchBar />
      </div>
      <Separator />
      <div className="space-y-4 my-2">
        <h3 className="text-lg">Sous-Catégorie</h3>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Chaise">Chaise</SelectItem>
              <SelectItem value="Table">Table</SelectItem>
              <SelectItem value="Télévision">Télévision</SelectItem>
              <SelectItem value="Meuble TV">Meuble TV</SelectItem>
              <SelectItem value="Ordinateur">Ordinateur</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="space-y-4 my-2">
        <h3 className="text-lg">Prix</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="min"
          />
          <Input
            type="number"
            placeholder="max"
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-4 my-2">
        <h3 className="text-lg">État</h3>
        <div className="items-top flex space-x-2 justify-between items-center">
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="état-neuf"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              État neuf
            </label>
          </div>
          <Checkbox
            id="état-neuf"
            className="h-6 w-6 "
          />
        </div>
        <div className="items-top flex space-x-2 justify-between items-center">
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="très-bon"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Très bon
            </label>
          </div>
          <Checkbox
            id="très-bon"
            className="h-6 w-6 "
          />
        </div>
        <div className="items-top flex space-x-2 justify-between items-center">
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="bon-état"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Bon
            </label>
          </div>
          <Checkbox
            id="bon-état"
            className="h-6 w-6 "
          />
        </div>
        <div className="items-top flex space-x-2 justify-between items-center">
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="état-satisfaisant"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              État satisfaisant
            </label>
          </div>
          <Checkbox
            id="état-satisfaisant"
            className="h-6 w-6 "
          />
        </div>
      </div>
      <Separator />
      <div className="space-y-4 my-2">
        <h3 className="text-lg">Tri</h3>
        <RadioGroup
          defaultValue="most-recent"
          className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="r2">Plus récents</Label>
            <RadioGroupItem
              value="most-recent"
              id="r1"
              className="w-6 h-6"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="r1">Pertinence</Label>
            <RadioGroupItem
              value="relevance"
              id="r2"
              className="w-6 h-6"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="r3">Plus anciennes</Label>
            <RadioGroupItem
              value="older"
              id="r3"
              className="w-6 h-6"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="r3">Prix croissant</Label>
            <RadioGroupItem
              value="ascending-price"
              id="r4"
              className="w-6 h-6"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="r3">Prix décroissant</Label>
            <RadioGroupItem
              value="descending-price"
              id="r5"
              className="w-6 h-6"
            />
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default LeftColumn;
