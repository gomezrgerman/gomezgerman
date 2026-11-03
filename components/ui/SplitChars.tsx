import { Fragment } from 'react'

interface SplitCharsProps {
  text: string
  /** Clase de cada letra, para animarlas con GSAP. */
  charClassName?: string
}

/**
 * Parte un texto en letras animables. Las letras de una misma palabra van juntas,
 * así los saltos de línea solo ocurren entre palabras. El texto completo queda
 * para lectores de pantalla; las letras sueltas se ocultan con aria-hidden.
 */
export default function SplitChars({ text, charClassName = 'split-ch' }: SplitCharsProps) {
  const words = text.split(' ')
  return (
    <>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          {wi > 0 && ' '}
          <span aria-hidden style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((char, ci) => (
              <span
                key={`${char}-${ci}`}
                className={charClassName}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  )
}
