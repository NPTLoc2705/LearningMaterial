import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const vocabFilePath = path.join(rootDir, 'Vocabulary_Units_7_8.md');
const grammarFilePath = path.join(rootDir, 'Grammar_Summary_Units_7_8.md');

const clientDataDir = path.join(rootDir, 'client', 'src', 'data');
if (!fs.existsSync(clientDataDir)) {
  fs.mkdirSync(clientDataDir, { recursive: true });
}

// -------------------------------------------------------------
// 1. Parse Vocabulary
// -------------------------------------------------------------
function parseVocabulary() {
  const content = fs.readFileSync(vocabFilePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  let currentUnit = 7;
  const items = [];
  let pendingNote = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## Unit 7')) {
      currentUnit = 7;
      continue;
    }
    if (line.startsWith('## Unit 8')) {
      currentUnit = 8;
      continue;
    }

    if (line.startsWith('> **Lưu ý:**')) {
      pendingNote = line.replace(/^>\s*/, '').trim();
      // Attach to previous item if available
      if (items.length > 0) {
        items[items.length - 1].notes = pendingNote;
      }
      continue;
    }

    if (line.startsWith('- **')) {
      const match = line.match(/^- \*\*([^*]+)\*\*(.*?):\s*(.*)$/);
      if (!match) {
        console.warn('Could not parse vocab line:', line);
        continue;
      }

      const rawWord = match[1].trim();
      let meta = match[2].trim();
      const meaningVi = match[3].trim();

      let partOfSpeech = undefined;
      let synonym = undefined;

      // Extract Part of Speech (e.g. (N), (V), (Adj), (N / V))
      const posMatch = meta.match(/\(([^)]+)\)/);
      if (posMatch) {
        partOfSpeech = posMatch[1].trim();
        meta = meta.replace(posMatch[0], '').trim();
      }

      // Extract Synonym (e.g. = search, = origin, = Task)
      const synMatch = meta.match(/=\s*([a-zA-Z\s]+)/);
      if (synMatch) {
        synonym = synMatch[1].trim();
      }

      // Check next line for example sentence
      let example = undefined;
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine.startsWith('*Ex:')) {
          const exMatch = nextLine.match(/^\*Ex:\s*(.*?)\s*\((.*?)\)\*$/);
          if (exMatch) {
            example = {
              sentenceEn: exMatch[1].trim(),
              sentenceVi: exMatch[2].trim(),
              rawText: nextLine
            };
          } else {
            const rawClean = nextLine.replace(/^\*Ex:\s*/, '').replace(/\*$/, '').trim();
            example = {
              sentenceEn: rawClean,
              sentenceVi: '',
              rawText: nextLine
            };
          }
        }
      }

      const id = `u${currentUnit}-${rawWord.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      items.push({
        id,
        unit: currentUnit,
        word: rawWord,
        partOfSpeech,
        synonym,
        meaningVi,
        example,
        notes: undefined
      });
    }
  }

  return items;
}

// -------------------------------------------------------------
// 2. Parse Markdown Table Helper
// -------------------------------------------------------------
function parseMarkdownTable(tableLines) {
  if (tableLines.length < 2) return null;
  const headers = tableLines[0]
    .split('|')
    .slice(1, -1)
    .map(c => c.trim());

  // skip separator line (e.g. | --- | --- |)
  const rows = [];
  for (let i = 2; i < tableLines.length; i++) {
    const cols = tableLines[i]
      .split('|')
      .slice(1, -1)
      .map(c => c.trim());
    if (cols.length > 0) {
      rows.push(cols);
    }
  }

  return { headers, rows };
}

// -------------------------------------------------------------
// 3. Parse Grammar Summary
// -------------------------------------------------------------
function parseGrammar() {
  const content = fs.readFileSync(grammarFilePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  let currentUnit = 7;
  const rawSections = [];
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('PART 1. UNIT 7')) {
      currentUnit = 7;
      continue;
    }
    if (line.includes('PART 2. UNIT 8')) {
      currentUnit = 8;
      continue;
    }

    if (line.startsWith('### ')) {
      if (currentSection) {
        rawSections.push(currentSection);
      }
      currentSection = {
        unit: currentUnit,
        header: line.replace('### ', '').trim(),
        lines: []
      };
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }
  if (currentSection) {
    rawSections.push(currentSection);
  }

  // Map Overview Categories
  const overviewCategories = {
    'Superlative adjectives': 'Main grammar',
    'Future: *will* vs. *going to*': 'Main grammar',
    'Making and responding to requests': 'Speaking strategy',
    'Word-level language points in Unit 7': 'Language notes',
    'Present perfect': 'Main grammar',
    '*For* and *since*': 'Main grammar',
    'Cause and effect': 'Reading strategy',
    '*There* + *to be*': 'Main grammar',
    'WH-questions': 'Extra grammar',
    'Talking about likes and dislikes': 'Speaking strategy',
    'Other language points in Unit 8': 'Language notes'
  };

  const topics = rawSections.map((sec, index) => {
    // Determine title & lesson metadata
    // e.g. "1. Superlative adjectives (Lesson 2)" -> title: "Superlative adjectives", lesson: "Lesson 2"
    const headerMatch = sec.header.match(/^(\d+)\.\s*(.*?)(?:\s*\((.*?)\))?$/);
    let title = sec.header;
    let lesson = undefined;
    let sectionNumber = index + 1;

    if (headerMatch) {
      sectionNumber = parseInt(headerMatch[1], 10);
      title = headerMatch[2].trim();
      if (headerMatch[3]) lesson = headerMatch[3].trim();
    } else {
      const altMatch = sec.header.match(/^(.*?)(?:\s*\((.*?)\))?$/);
      if (altMatch) {
        title = altMatch[1].trim();
        if (altMatch[2]) lesson = altMatch[2].trim();
      }
    }

    // Determine category
    let category = 'Main grammar';
    for (const [key, cat] of Object.entries(overviewCategories)) {
      if (title.includes(key) || sec.header.includes(key)) {
        category = cat;
        break;
      }
    }

    // Parse tables, examples, notes, summaries
    const ruleTables = [];
    const examples = [];
    const notes = [];
    let summaryText = '';
    const patterns = [];

    let inTable = false;
    let currentTableLines = [];

    for (let j = 0; j < sec.lines.length; j++) {
      const rawLine = sec.lines[j];
      const trimmed = rawLine.trim();

      if (trimmed.startsWith('|')) {
        inTable = true;
        currentTableLines.push(trimmed);
        continue;
      } else if (inTable) {
        inTable = false;
        const parsedTable = parseMarkdownTable(currentTableLines);
        if (parsedTable) ruleTables.push(parsedTable);
        currentTableLines = [];
      }

      if (!trimmed) continue;

      if (trimmed.startsWith('- ')) {
        const itemContent = trimmed.substring(2).trim();
        if (title.includes('language points') || title.includes('Word-level')) {
          notes.push(itemContent);
        } else {
          examples.push(itemContent);
        }
      } else if (trimmed.startsWith('**Use:**') || trimmed.startsWith('Use ')) {
        summaryText = (summaryText ? summaryText + '\n' : '') + trimmed;
      } else if (trimmed.startsWith('Useful pattern') || trimmed.startsWith('Note:')) {
        patterns.push(trimmed);
      } else if (trimmed.startsWith('The lesson practices') || trimmed.startsWith('After these expressions')) {
        patterns.push(trimmed);
      } else if (!summaryText && !trimmed.startsWith('Examples from') && !trimmed.startsWith('More examples')) {
        summaryText = trimmed;
      }
    }

    if (inTable && currentTableLines.length > 0) {
      const parsedTable = parseMarkdownTable(currentTableLines);
      if (parsedTable) ruleTables.push(parsedTable);
    }

    // ---------------------------------------------------------
    // Construct Verbatim Practice Questions
    // (Extracted exclusively from sentences within this topic)
    // ---------------------------------------------------------
    const practiceExercises = [];

    if (title.includes('Superlative')) {
      const drillData = [
        { orig: 'I am the tallest in my family.', target: 'the tallest', prompt: 'I am ______ in my family. (tall)' },
        { orig: 'This box is the biggest one.', target: 'the biggest', prompt: 'This box is ______ one. (big)' },
        { orig: 'My house is the largest one in our neighborhood.', target: 'the largest', prompt: 'My house is ______ one in our neighborhood. (large)' },
        { orig: 'This exam is the easiest one.', target: 'the easiest', prompt: 'This exam is ______ one. (easy)' },
        { orig: 'This is the most famous dish.', target: 'the most famous', prompt: 'This is ______ dish. (famous)' },
        { orig: 'It is the most interesting movie in my life.', target: 'the most interesting', prompt: 'It is ______ movie in my life. (interesting)' }
      ];
      drillData.forEach((d, dIdx) => {
        practiceExercises.push({
          id: `u7-sup-${dIdx + 1}`,
          prompt: d.prompt,
          correctAnswer: d.target,
          type: 'fill-in-the-blank',
          sourceSentence: d.orig
        });
      });
    } else if (title.includes('will') && title.includes('going to')) {
      practiceExercises.push(
        {
          id: 'u7-fut-1',
          prompt: 'Look at those clouds. It is ______ rain. (Prediction based on evidence)',
          correctAnswer: 'going to',
          options: ['going to', 'will'],
          type: 'multiple-choice',
          sourceSentence: "Look at those clouds. It's going to rain."
        },
        {
          id: 'u7-fut-2',
          prompt: 'They ______ win their next match. (Opinion prediction: we think something will happen)',
          correctAnswer: "won't",
          options: ["won't", "aren't going to"],
          type: 'multiple-choice',
          sourceSentence: "They won't win their next match."
        },
        {
          id: 'u7-fut-3',
          prompt: "It's cold today. I don't think I'll ______ out.",
          correctAnswer: 'go',
          options: ['go', 'going to go', 'went'],
          type: 'multiple-choice',
          sourceSentence: "It's cold today. I don't think I'll go out."
        },
        {
          id: 'u7-fut-4',
          prompt: "I'm hungry. I think I'll ______ something to eat.",
          correctAnswer: 'have',
          options: ['have', 'having', 'am going to have'],
          type: 'multiple-choice',
          sourceSentence: "I'm hungry. I think I'll have something to eat."
        }
      );
    } else if (title.includes('requests')) {
      practiceExercises.push(
        {
          id: 'u7-req-1',
          prompt: '______ I borrow your pen?',
          correctAnswer: 'Could',
          options: ['Could', 'Please let', 'Do'],
          type: 'multiple-choice',
          sourceSentence: 'Could I borrow your pen?'
        },
        {
          id: 'u7-req-2',
          prompt: '______ you lend me your smartphone?',
          correctAnswer: 'Can',
          options: ['Can', 'May I', 'Let'],
          type: 'multiple-choice',
          sourceSentence: 'Can you lend me your smartphone?'
        },
        {
          id: 'u7-req-3',
          prompt: 'Please ______ me go out.',
          correctAnswer: 'let',
          options: ['let', 'could', 'may'],
          type: 'multiple-choice',
          sourceSentence: 'Please let me go out.'
        },
        {
          id: 'u7-req-4',
          prompt: 'When responding to a request with agreement, you can say: "Of course. ______ you are!"',
          correctAnswer: 'Here',
          options: ['Here', 'There', 'Where'],
          type: 'multiple-choice',
          sourceSentence: 'Of course. Here you are! / Sure. Here you go.'
        }
      );
    } else if (title.includes('Present perfect')) {
      practiceExercises.push(
        {
          id: 'u8-pp-1',
          prompt: 'They ______ (learn) English for 2 years.',
          correctAnswer: 'have learned',
          type: 'fill-in-the-blank',
          sourceSentence: 'They have learned English for 2 years.'
        },
        {
          id: 'u8-pp-2',
          prompt: 'They ______ (not meet) each other since 1999.',
          correctAnswer: 'have not met',
          type: 'fill-in-the-blank',
          sourceSentence: 'They have not met each other since 1999.'
        },
        {
          id: 'u8-pp-3',
          prompt: '______ you completed the final exam?',
          correctAnswer: 'Have',
          options: ['Have', 'Has', 'Did'],
          type: 'multiple-choice',
          sourceSentence: 'Have you completed the final exam?'
        },
        {
          id: 'u8-pp-4',
          prompt: 'People ______ (play) cards for about twelve hundred years.',
          correctAnswer: 'have played',
          type: 'fill-in-the-blank',
          sourceSentence: 'People have played cards for about twelve hundred years.'
        },
        {
          id: 'u8-pp-5',
          prompt: '______ you ever eaten sushi? → Yes, I have.',
          correctAnswer: 'Have',
          options: ['Have', 'Did', 'Were'],
          type: 'multiple-choice',
          sourceSentence: 'Have you ever eaten sushi? → Yes, I have.'
        }
      );
    } else if (title.includes('For') && title.includes('since')) {
      practiceExercises.push(
        {
          id: 'u8-fs-1',
          prompt: 'We have talked ______ 30 minutes in the class.',
          correctAnswer: 'for',
          options: ['for', 'since'],
          type: 'multiple-choice',
          sourceSentence: 'We have talked for 30 minutes in the class.'
        },
        {
          id: 'u8-fs-2',
          prompt: 'It has rained ______ a week.',
          correctAnswer: 'for',
          options: ['for', 'since'],
          type: 'multiple-choice',
          sourceSentence: 'It has rained for a week.'
        },
        {
          id: 'u8-fs-3',
          prompt: 'I have waited here ______ 9 a.m.',
          correctAnswer: 'since',
          options: ['since', 'for'],
          type: 'multiple-choice',
          sourceSentence: 'I have waited here since 9 a.m.'
        },
        {
          id: 'u8-fs-4',
          prompt: 'My parents have lived in Vietnam ______ 1980.',
          correctAnswer: 'since',
          options: ['since', 'for'],
          type: 'multiple-choice',
          sourceSentence: 'My parents have lived in Vietnam since 1980.'
        }
      );
    } else if (title.includes('Cause and effect')) {
      practiceExercises.push(
        {
          id: 'u8-ce-1',
          prompt: 'She is never interested in studying ______ she wants to become a basketball player.',
          correctAnswer: 'because',
          options: ['because', 'so', 'as a result'],
          type: 'multiple-choice',
          sourceSentence: 'She is never interested in studying because she wants to become a basketball player.'
        },
        {
          id: 'u8-ce-2',
          prompt: "I don't think he wants to attend the party ______ he is an introvert.",
          correctAnswer: 'since',
          options: ['since', 'so', 'therefore'],
          type: 'multiple-choice',
          sourceSentence: "I don't think he wants to attend the party since he is an introvert."
        },
        {
          id: 'u8-ce-3',
          prompt: 'It rained, ______ I got wet.',
          correctAnswer: 'so',
          options: ['so', 'because', 'since'],
          type: 'multiple-choice',
          sourceSentence: 'It rained, so I got wet.'
        },
        {
          id: 'u8-ce-4',
          prompt: 'She used to play taekwondo. ______, she knows how to defend herself.',
          correctAnswer: 'As a result',
          options: ['As a result', 'Because', 'Since'],
          type: 'multiple-choice',
          sourceSentence: 'She used to play taekwondo. As a result, she knows how to defend herself.'
        }
      );
    } else if (title.includes('There') && title.includes('to be')) {
      practiceExercises.push(
        {
          id: 'u8-ttb-1',
          prompt: '______ twenty chairs in the classroom. (Present)',
          correctAnswer: 'There are',
          options: ['There are', 'There is', 'There were'],
          type: 'multiple-choice',
          sourceSentence: 'There are twenty chairs in the classroom.'
        },
        {
          id: 'u8-ttb-2',
          prompt: '______ three worms in my salad. (Past)',
          correctAnswer: 'There were',
          options: ['There were', 'There was', 'There are'],
          type: 'multiple-choice',
          sourceSentence: 'There were three worms in my salad.'
        },
        {
          id: 'u8-ttb-3',
          prompt: '______ many earthquakes in this century. (Present perfect)',
          correctAnswer: 'There have been',
          options: ['There have been', 'There has been', 'There were'],
          type: 'multiple-choice',
          sourceSentence: 'There have been many earthquakes in this century.'
        },
        {
          id: 'u8-ttb-4',
          prompt: '______ an excellent party next weekend. (Future with will)',
          correctAnswer: 'There will be',
          options: ['There will be', 'There was', 'There is'],
          type: 'multiple-choice',
          sourceSentence: 'There will be an excellent party next weekend.'
        },
        {
          id: 'u8-ttb-5',
          prompt: '______ fireworks at the festival. (Future with going to)',
          correctAnswer: 'There are going to be',
          options: ['There are going to be', 'There is going to be', 'There will'],
          type: 'multiple-choice',
          sourceSentence: 'There are going to be fireworks at the festival.'
        }
      );
    } else if (title.includes('WH-questions')) {
      practiceExercises.push(
        {
          id: 'u8-wh-1',
          prompt: '______ is this? – It\'s a book. (Asks about things/objects)',
          correctAnswer: 'What',
          options: ['What', 'Where', 'When', 'Who'],
          type: 'multiple-choice',
          sourceSentence: "What is this? – It's a book."
        },
        {
          id: 'u8-wh-2',
          prompt: '______ do you live? – I live in Hanoi. (Asks about place)',
          correctAnswer: 'Where',
          options: ['Where', 'When', 'Why', 'How'],
          type: 'multiple-choice',
          sourceSentence: 'Where do you live? – I live in Hanoi.'
        },
        {
          id: 'u8-wh-3',
          prompt: '______ do you go to school? – In the morning. (Asks about time)',
          correctAnswer: 'When',
          options: ['When', 'Where', 'What', 'Which'],
          type: 'multiple-choice',
          sourceSentence: 'When do you go to school? – In the morning.'
        },
        {
          id: 'u8-wh-4',
          prompt: '______ do you like to eat apples? – Because they are sweet. (Asks about reason)',
          correctAnswer: 'Why',
          options: ['Why', 'How', 'What', 'Where'],
          type: 'multiple-choice',
          sourceSentence: 'Why do you like to eat apples? – Because they are sweet.'
        },
        {
          id: 'u8-wh-5',
          prompt: 'With ______ am I speaking? – You are speaking with Lisa. (Object of preposition)',
          correctAnswer: 'whom',
          options: ['whom', 'who', 'what', 'whose'],
          type: 'multiple-choice',
          sourceSentence: 'With whom am I speaking? – You are speaking with Lisa.'
        },
        {
          id: 'u8-wh-6',
          prompt: '______ color do you prefer to wear? – Pink. (Making a choice)',
          correctAnswer: 'Which',
          options: ['Which', 'Where', 'When', 'Who'],
          type: 'multiple-choice',
          sourceSentence: 'Which color do you prefer to wear? – Pink.'
        }
      );
    } else if (title.includes('likes and dislikes')) {
      practiceExercises.push(
        {
          id: 'u8-ld-1',
          prompt: 'Eating healthy food is my ______.',
          correctAnswer: 'favorite',
          options: ['favorite', 'into', 'dislike'],
          type: 'multiple-choice',
          sourceSentence: 'Eating healthy food is my favorite.'
        },
        {
          id: 'u8-ld-2',
          prompt: "I don't like ______ up late. (Note: use noun or verb + -ing)",
          correctAnswer: 'staying',
          options: ['staying', 'stay', 'stayed'],
          type: 'multiple-choice',
          sourceSentence: "I don't like staying up late."
        },
        {
          id: 'u8-ld-3',
          prompt: 'I am really ______ playing mobile games.',
          correctAnswer: 'into',
          options: ['into', 'favorite', 'mind'],
          type: 'multiple-choice',
          sourceSentence: 'I am (really) into …'
        }
      );
    }

    const cleanTitle = title.replace(/[*()]/g, '').trim();
    const id = `u${sec.unit}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

    return {
      id,
      unit: sec.unit,
      sectionNumber,
      lesson,
      title,
      category,
      summaryText,
      ruleTables,
      patterns,
      examples,
      notes,
      practiceExercises
    };
  });

  return topics;
}

// -------------------------------------------------------------
// Execution
// -------------------------------------------------------------
console.log('--- Compiling Markdown Content to Typed JSON ---');

const vocabData = parseVocabulary();
console.log(`Parsed ${vocabData.length} vocabulary entries.`);
fs.writeFileSync(path.join(clientDataDir, 'vocabulary.json'), JSON.stringify(vocabData, null, 2), 'utf-8');

const grammarData = parseGrammar();
console.log(`Parsed ${grammarData.length} grammar topics.`);
fs.writeFileSync(path.join(clientDataDir, 'grammar.json'), JSON.stringify(grammarData, null, 2), 'utf-8');

console.log('Successfully generated vocabulary.json and grammar.json in client/src/data/');
