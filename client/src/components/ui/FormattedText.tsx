import React, { memo } from 'react';

export interface FormattedTextProps {
  text: string;
  className?: string;
}

// Hoisted RegExp to avoid repeated compilation across renders (js-hoist-regexp)
const FORMATTED_TEXT_REGEX = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

/**
 * Safe, zero-HTML-injection text renderer for inline markdown (**bold**, *italic*).
 * Replaces dangerouslySetInnerHTML with pure React element tree construction.
 */
export const FormattedText = memo(function FormattedText({
  text,
  className = '',
}: FormattedTextProps) {
  if (!text) return null;

  const parts = text.split(FORMATTED_TEXT_REGEX);

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
});
