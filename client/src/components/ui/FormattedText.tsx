import React from 'react';

export interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Safe, zero-HTML-injection text renderer for inline markdown (**bold**, *italic*).
 * Replaces dangerouslySetInnerHTML with pure React element tree construction.
 */
export function FormattedText({ text, className = '' }: FormattedTextProps) {
  if (!text) return null;

  // Split by bold (**...**) and italic (*...*) tokens
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="font-semibold text-charcoal">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={index} className="italic text-charcoal/90">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
