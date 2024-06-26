import { SearchBar } from "@/components/category/searchbar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  setOrderBy: (orderBy: string) => void;
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
  min: number;
  max: number;
}

const LeftColumn: React.FC<Props> = ({
  setOrderBy,
  setMinPrice,
  setMaxPrice,
  min,
  max,
}) => {
  //TODO: Implementation of left column filter

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    if (Number.isNaN(value)) return;

    if (value <= 0) {
      setMinPrice(0);
      return;
    }

    if (value > max) {
      setMinPrice(max);
      return;
    }

    setMinPrice(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    if (Number.isNaN(value)) return;

    if (value <= 0) {
      setMaxPrice(0);
      return;
    }

    if (value < min) {
      setMaxPrice(min);
      return;
    }

    setMaxPrice(value);
  };

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
            value={min || ""}
            onChange={(e) => handleMinChange(e)}
          />
          <Input
            type="number"
            placeholder="max"
            value={max || ""}
            onChange={(e) => handleMaxChange(e)}
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
    </>
  );
};

export default LeftColumn;
