# Bản Đặc Tả Thiết Kế: Cải Tiến Giao Diện Ngữ Pháp & Hệ Thống Đề Luyện Động (Dynamic Mixed Drills)

- **Ngày tạo**: 2026-10-22
- **Trạng thái**: Chờ duyệt (Pending Review)
- **Phạm vi**: Ứng dụng web học tập Tiếng Anh Unit 7 & 8 (`client/src/components/grammar/`, `client/src/pages/grammar-lesson.tsx`, `client/src/types/grammar.ts`)

---

## 1. Mục Tiêu & Vấn Đề Cần Giải Quyết

### Vấn đề hiện tại:
1. **Phần Lý thuyết & Công thức**: Các công thức hiện đang được gom chung vào một bảng ma trận lớn, ví dụ nằm dồn ở đáy trang khiến học sinh khó liên hệ giữa công thức cụ thể và cách áp dụng thực tế; thiếu phần giải thích "tại sao lại dùng như vậy" và thiếu cảnh báo các bẫy ngữ pháp học sinh hay nhầm lẫn nhất.
2. **Phần Bài tập vận dụng**: Các bài tập hiện tại còn mang tính đơn điệu (chỉ điền từ đơn lẻ), thiếu ngữ cảnh bài đọc thực tế (như định dạng đề thi Cambridge KET A2), chưa có cơ chế xáo trộn nhiều dạng bài và chưa có lời giải thích chi tiết vì sao đúng/sai sau khi nộp bài.

### Mục tiêu cần đạt:
1. **Thiết kế lại Tab "Lý thuyết & Công thức" theo mô hình Modular Rule Cards**: Mỗi công thức ngữ pháp là một khối thẻ độc lập gồm: (1) Công thức chuẩn, (2) Ví dụ áp dụng trực tiếp, (3) Giải thích vì sao dùng, và (4) Cảnh báo bẫy hay nhầm lẫn nhất (Common Pitfall Warning).
2. **Xây dựng Động cơ Đề Luyện Hỗn Hợp Động (Dynamic Mixed Drill Engine)**:
   - Mỗi lượt làm bài tự động tạo ra **6 câu hỏi**, kết hợp từ **ít nhất 3 dạng bài khác nhau** (Bài đọc KET điền từ, Tìm và sửa lỗi sai, Viết lại câu giữ nguyên nghĩa, v.v.).
   - Sau khi nộp bài, hiển thị kết quả trực quan kèm **giải thích cặn kẽ vì sao đúng và vì sao sai**.
   - Cung cấp 2 lựa chọn thông minh: **"Làm lại đề này"** (giữ nguyên 6 câu cũ để sửa sai) hoặc **"Tạo đề luyện mới"** (xáo trộn ngẫu nhiên một tổ hợp 3 dạng đề mới).

---

## 2. Mô Hình Dữ Liệu (Data Model Specification)

Nâng cấp các giao diện TypeScript trong `client/src/types/grammar.ts`:

```typescript
export type GrammarDrillType =
  | 'reading-cloze'       // Dạng 1: Bài đọc KET điền từ/chia động từ
  | 'error-correction'    // Dạng 5: Tìm lỗi sai & sửa lại
  | 'sentence-rewrite'    // Dạng 9: Viết lại câu với từ khóa bắt buộc
  | 'multiple-choice'     // Dạng 3: Trắc nghiệm ngữ cảnh KET
  | 'word-scramble'       // Dạng 10: Xếp các khối từ thành câu
  | 'sentence-combining'; // Dạng 12: Nối 2 câu bằng liên từ

export interface ModularRuleCard {
  id: string;
  title: string;
  formula: string;
  exampleEn: string;
  exampleVi?: string;
  explanation: string;
  commonPitfall: {
    confusedWith: string; // Tên ngữ pháp hay bị nhầm (ví dụ: "So sánh hơn" hoặc "Will")
    mistakeExample: string; // Câu sai học sinh hay viết
    ruleTip: string; // Mẹo nhớ nhanh để không bao giờ sai
  };
}

export interface DynamicDrillQuestion {
  id: string;
  type: GrammarDrillType;
  typeLabel: string; // "Bài đọc KET", "Tìm lỗi sai", "Viết lại câu"...
  prompt: string;
  passage?: string; // Dành cho bài đọc reading-cloze
  bracketVerb?: string; // Động từ trong ngoặc cần chia
  options?: string[]; // Dành cho multiple-choice
  correctAnswer: string;
  errorWord?: string; // Dành cho error-correction (từ bị sai trong câu)
  targetKeyword?: string; // Dành cho sentence-rewrite (ví dụ: [SMALLEST])
  scrambledWords?: string[]; // Dành cho word-scramble
  explanation: {
    ruleReason: string; // Vì sao đáp án này đúng
    whyWrong?: string; // Phân tích lỗi sai thường gặp
    grammarTip: string; // Bí kíp ghi nhớ
  };
  sourceContext?: string;
}

export interface GrammarTopicExtended {
  id: string;
  unit: 7 | 8;
  title: string;
  category: string;
  summaryText?: string;
  modularRules: ModularRuleCard[]; // Dữ liệu thẻ công thức phân tầng mới
  drillBank: DynamicDrillQuestion[]; // Ngân hàng câu hỏi đa dạng
}
```

---

## 3. Kiến Trúc Giao Diện & Trải Nghiệm Người Dùng (UI/UX Architecture)

### 3.1. Tab 1: "Lý thuyết & Công thức" (Modular Formula Cards)
- Sử dụng component `ModularRuleRenderer.tsx` thay thế bảng tĩnh:
  - **Khối Công Thức**: Hiển thị trên nền font monospace (`Geist Mono`) với khung viền kép và huy hiệu phân loại.
  - **Khối Ví Dụ**: Hộp trích dẫn màu ngà (`#FBFBFA`) in nghiêng, có câu dịch tiếng Việt.
  - **Khối Giải Thích**: Văn bản giải thích ngắn gọn lý do tại sao ngữ cảnh này lại áp dụng cấu trúc đó.
  - **Hộp Cảnh Báo Bẫy Nhầm Lẫn (Pitfall Alert Box)**: Nổi bật với tông màu hổ phách nhạt (`#FBF3DB`, viền `#F5E6BF`), icon cảnh báo, nêu rõ:
    - Ngữ pháp đối chiếu dễ nhầm.
    - Ví dụ câu sai điển hình.
    - Mẹo nhớ nhanh (Rule Tip).

### 3.2. Tab 2: "Bài tập vận dụng" (Dynamic Mixed Drill Engine)
- Component `DynamicDrillEngine.tsx`:
  - **Thuật toán bốc 3 dạng đề / 6 câu (3-Type Sampling)**:
    1. Lấy tất cả câu hỏi trong `drillBank` của chủ điểm hiện tại.
    2. Gom nhóm câu hỏi theo `type`.
    3. Chọn ngẫu nhiên 3 `type` khác nhau (ví dụ: `reading-cloze`, `error-correction`, `sentence-rewrite`).
    4. Bốc mỗi dạng 2 câu $\rightarrow$ Tổng cộng đúng **6 câu hỏi**.
    5. Lưu danh sách 6 câu này vào trạng thái `currentDrillQuestions` để phục vụ tính năng "Làm lại đề này".
  - **Thanh trạng thái làm bài**:
    - Hiển thị tiến trình `CÂU 1 / 6`, `CÂU 2 / 6`...
    - Huy hiệu phân loại dạng bài ở mỗi câu (ví dụ: `[Bài đọc KET]`, `[Tìm lỗi sai]`, `[Viết lại câu]`).
  - **Giao diện làm bài tương ứng với từng dạng**:
    - *Bài đọc KET*: Hiển thị đoạn văn hoàn chỉnh với các ô trống để nhập từ hoặc chia động từ.
    - *Tìm lỗi sai*: Hiển thị câu văn, học sinh chạm vào từ sai để gõ từ sửa đúng.
    - *Viết lại câu*: Hiển thị câu gốc, từ khóa trong ngoặc vuông và ô nhập câu mới.
    - *Trắc nghiệm*: 4 phương án bấm chọn.
  - **Màn hình Nộp bài & Bảng giải thích đáp án (Review Screen)**:
    - Khối điểm số tổng quát: `{score} / 6 câu đúng ({percentage}%)`.
    - Danh sách chi tiết từng câu:
      - Câu đúng: Huy hiệu xanh `Chính xác` kèm lý do vì sao đúng.
      - Câu sai: Huy hiệu đỏ `Chưa chính xác` $\rightarrow$ Hiển thị rõ câu trả lời của học sinh vs. Đáp án đúng $\rightarrow$ Hộp giải thích chi tiết: *"Tại sao sai? Phân tích quy tắc ngữ pháp tương ứng"*.
  - **Cụm 2 nút hành động**:
    - 🔁 **"Làm lại đề này" (Retry Same Drill)**: Giữ nguyên 6 câu hỏi này, xóa các câu trả lời cũ để học sinh tự làm lại.
    - 🎲 **"Tạo đề luyện mới" (New Randomized Drill)**: Kích hoạt thuật toán bốc ngẫu nhiên 3 dạng bài và 6 câu hỏi mới.

---

## 4. Ngân Hàng Dữ Liệu Bài Tập Cho 11 Chủ Điểm Ngữ Pháp

Xây dựng kho dữ liệu chi tiết cho cả 11 chủ điểm:
1. **Unit 7 - Lesson 2: Superlative Adjectives** (So sánh nhất: tính từ ngắn, tính từ dài, bất quy tắc, bẫy so sánh hơn).
2. **Unit 7 - Lesson 4: Future with Will vs. Be going to** (Kế hoạch định trước vs Quyết định bộc phát, bẫy dự đoán có bằng chứng).
3. **Unit 7 - Lesson 1: Making and responding to requests** (Can/Could/May/Would, bẫy chia thì động từ sau trợ động từ).
4. **Unit 7 - Lesson 1 & 2: Word-level language points** (Hậu tố -ible/-able, từ loại trong câu).
5. **Unit 8 - Lesson 2: Present Perfect** (Have/Has + V3, trải nghiệm ever/never, bẫy mốc thời gian quá khứ đơn).
6. **Unit 8 - Lesson 2: For and Since** (Mốc thời gian vs Khoảng thời gian).
7. **Unit 8 - Lesson 2: Cause and Effect** (Because, Since, So, As a result).
8. **Unit 8 - Lesson 4: There + To be in different tenses** (There was/were vs There has/have been, bẫy số ít số nhiều).
9. **Unit 8 - Lesson 4: WH-Questions in the Past** (Trật tự từ trong câu hỏi quá khứ với Did, What, When, Where).
10. **Unit 8 - Lesson 1: Likes and Dislikes** (Gerunds V-ing vs To-infinitive).
11. **Unit 7 & 8: Reading & Speaking Strategies**.

---

## 5. Kế Hoạch Triển Khai (Implementation Steps)

1. **Bước 1**: Cập nhật kiểu dữ liệu [client/src/types/grammar.ts](file:///d:/GitHub/LearningMaterial/client/src/types/grammar.ts).
2. **Bước 2**: Xây dựng kho dữ liệu chi tiết cho 11 chủ điểm ngữ pháp với đầy đủ các thẻ lý thuyết + bẫy nhầm lẫn + ngân hàng câu hỏi đa dạng trong `client/src/data/grammar-extended.ts`.
3. **Bước 3**: Tạo component `ModularRuleRenderer.tsx` cho Tab Lý thuyết.
4. **Bước 4**: Tạo component `DynamicDrillEngine.tsx` quản lý thuật toán bốc 3 dạng bài / 6 câu, xử lý các dạng bài tương tác, chấm điểm và bảng giải thích đúng/sai.
5. **Bước 5**: Cập nhật [client/src/pages/grammar-lesson.tsx](file:///d:/GitHub/LearningMaterial/client/src/pages/grammar-lesson.tsx) để tích hợp các component mới.
6. **Bước 6**: Kiểm thử toàn diện bằng `npm run build` và kiểm tra tương tác trên trình duyệt qua `browser_subagent`.
