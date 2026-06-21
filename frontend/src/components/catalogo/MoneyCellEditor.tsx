import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { CustomCellEditorProps } from 'ag-grid-react'

function parseLocaleNumber(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const hasComma = trimmed.includes(',')
  const hasDot = trimmed.includes('.')
  let normalized = trimmed
  if (hasComma && hasDot) {
    normalized = trimmed.replace(/\./g, '').replace(',', '.')
  } else if (hasComma) {
    normalized = trimmed.replace(',', '.')
  }
  const num = parseFloat(normalized)
  return isNaN(num) ? null : num
}

function initialFromValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return ''
  const str = String(value)
  const num = parseFloat(str)
  if (isNaN(num)) return ''
  return num
    .toFixed(2)
    .replace('.', ',')
}

export const MoneyCellEditor = forwardRef(function MoneyCellEditor(
  props: CustomCellEditorProps,
  ref,
) {
  const [value, setValue] = useState<string>(() => initialFromValue(props.value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.focus()
    el.select()
  }, [])

  useImperativeHandle(ref, () => ({
    getValue() {
      return parseLocaleNumber(value)
    },
    isCancelBeforeStart() {
      return false
    },
    isCancelAfterEnd() {
      return false
    },
  }))

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="ecommerce-cell-editor"
    />
  )
})
