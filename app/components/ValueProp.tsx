// ValueProp is now folded into the Hero trust strip.
// This component is kept as a no-op so sections_order can still reference it
// without breaking renders in other business configs.
export default function ValueProp({ items: _items }: { items: string[] }) {
  return null
}
