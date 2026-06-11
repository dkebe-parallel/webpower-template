import { WhyUsItem } from '@/lib/types'

// ValueProp is now folded into the Hero trust strip.
// Kept as a no-op so sections_order can still reference it.
export default function ValueProp({ items: _items }: { items: Array<WhyUsItem | string> }) {
  return null
}
