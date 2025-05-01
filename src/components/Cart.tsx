import { ShoppingBagIcon } from "@heroicons/react/24/outline";

interface CartProps {
  itemCount: number;
}

export default function Cart({ itemCount }: CartProps) {
  return (
    <div className="relative">
      <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </div>
  );
}
