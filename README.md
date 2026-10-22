# Góc Học Tập Tiếng Anh Unit 7 & 8 | English Study Archive

Ứng dụng web học tập chuyên sâu, tương tác cao và hoạt động hoàn toàn offline dành cho học sinh đang học chương trình Tiếng Anh Unit 7 & 8:
- **Unit 7**: Cool Apps and Gadgets
- **Unit 8**: Into the Past

Toàn bộ dữ liệu bài học được trích xuất nguyên bản 100% từ hai tài liệu nguồn:
- [`Vocabulary_Units_7_8.md`](file:///Vocabulary_Units_7_8.md): Tuyển tập 58 từ vựng trọng tâm kèm loại từ, từ đồng nghĩa, định nghĩa tiếng Việt chuẩn xác và câu ví dụ song ngữ.
- [`Grammar_Summary_Units_7_8.md`](file:///Grammar_Summary_Units_7_8.md): 11 chủ điểm ngữ pháp với bảng so sánh trực quan, công thức cấu trúc, câu ví dụ bài học và bài tập vận dụng.

---

## 🎯 Ứng Dụng Này Được Sinh Ra Để Làm Gì?

Học sinh khi học ngoại ngữ thường gặp phải 3 rào cản lớn:
1. **Tài liệu học tập rời rạc, thiếu tương tác**: Học sinh chỉ nhìn vào văn bản tĩnh hoặc file Word/PDF dẫn đến việc học thụ động, dễ mau quên.
2. **Rào cản từ ngữ công cụ**: Các nền tảng học tiếng Anh quốc tế thường sử dụng 100% giao diện tiếng Anh với những thuật ngữ phức tạp, khiến học sinh chưa vững tiếng Anh cảm thấy bối rối khi thao tác.
3. **Thiếu phản xạ ghi nhớ chủ động (Active Recall)**: Việc đọc lướt qua từ vựng không tạo được phản xạ sâu bằng việc tự mình nhớ từ, lật thẻ và gõ lại đúng chính tả.

### Sứ mệnh & Giá trị cốt lõi của ứng dụng:
- **Bám sát 100% giáo trình (Grounding Truth)**: Tuyệt đối không tự bịa từ, không thêm bớt quy tắc ngoài luồng. Toàn bộ từ vựng, ví dụ, công thức ngữ pháp đều chuẩn hóa chính xác theo nội dung giảng dạy của giáo viên.
- **Giao diện tiếng Việt thân thiện, thấu hiểu học sinh**: Toàn bộ chỉ dẫn, mô tả tính năng, nút bấm, phản hồi bài tập đều được bản địa hóa bằng tiếng Việt rõ ràng, giúp học sinh tập trung tối đa vào việc tiếp thu kiến thức thay vì loay hoay tìm hiểu cách sử dụng web.
- **Phương pháp ghi nhớ 3 tầng (Spaced Repetition & Active Recall)**:
  - *Tầng 1 - Tiếp thu*: Tra cứu từ điển mini, xem ví dụ ngữ cảnh và nghe phát âm chuẩn bản xứ.
  - *Tầng 2 - Khắc sâu*: Sử dụng Flashcard 3D để kiểm tra khả năng gợi nhớ và phân loại từ theo mức độ ghi nhớ (*Đã thuộc* / *Cần ôn lại*).
  - *Tầng 3 - Kiểm chứng*: Làm bài tập trắc nghiệm nghĩa và thử thách gõ từ kiểm tra lỗi chính tả.
- **Tiện lợi, an toàn và tức thì (Zero-friction & Offline-first)**: Không cần đăng ký tài khoản, không yêu cầu kết nối cơ sở dữ liệu bên ngoài, không quảng cáo phiền toái. Mọi tiến độ học tập được lưu trực tiếp trên thiết bị của học sinh qua `localStorage`.

---

## 🎨 Thiết Kế Giao Diện Web Có Những Gì?

Ứng dụng được thiết kế theo phong cách **Editorial Minimalist & Warm Monochrome**, mang lại cảm giác học tập tĩnh tâm, sang trọng như một cuốn tạp chí học thuật cao cấp, loại bỏ hoàn toàn các màu sắc lòe loẹt hay thành phần gây xao nhãng.

### 1. Hệ thống thiết kế chuẩn mực (Design System):
- **Bảng màu ấm áp (Warm Bone Canvas)**: Tông nền ngà ấm `#FBFBFA` dịu mắt, kết hợp màu chữ than đen `#141413` sắc nét và các điểm nhấn màu pastel tinh tế (`#EDF3EC` xanh lá, `#FDEBEC` đỏ nhạt, `#E1F3FE` xanh dương, `#FBF3DB` hổ phách).
- **Nghệ thuật chữ báo chí (Editorial Typography)**: Tiêu đề sử dụng font serif cổ điển thanh lịch **Newsreader**, kết hợp cùng font **Geist** hiện đại cho nội dung văn bản và **Geist Mono** cho các công thức, thẻ mã số.
- **Cấu trúc lồng viền kép (Double-Bezel Concentric Enclosures)**: Các khung thẻ học tập được bao bọc bởi lớp viền ngoài bo cong mềm mại và lớp lõi trắng bên trong, tạo chiều sâu thị giác sang trọng mà không cần đến các hiệu ứng đổ bóng nặng nề.
- **Tương thích hoàn hảo mọi thiết bị điện tử (Mobile-First Ergonomics)**:
  - Tối ưu vùng chạm ngón tay (Touch targets ≥ 42px) cho điện thoại thông minh (iPhone, Android) và máy tính bảng (iPad, Tablet).
  - Thanh điều hướng tự động chuyển thành **Mobile Drawer** vuốt chạm tiện lợi trên màn hình nhỏ.
  - Các bảng so sánh ngữ pháp dài được trang bị cơ chế cuộn ngang thông minh (`overflow-x-auto min-w-[320px]`), không bao giờ bị vỡ khung hình.

---

### 2. Các phân hệ chức năng trên giao diện:

#### 📊 A. Bảng Điều Khiển Bento (Asymmetrical Bento Dashboard)
- **Khu vực tiêu đề (Editorial Masthead)**: Giới thiệu chủ đề bài học Unit 7 & 8 cùng lời chào học tập định hướng.
- **Đồng hồ số liệu nhanh (Telemetry Badges)**: Thống kê tức thì số lượng từ vựng đã nắm vững (`/58 từ`) và số lượng bài ngữ pháp đã hoàn thành (`/11 chủ điểm`).
- **Khối tiến độ phân tầng (Segmented Mastery Bar)**: Thanh đo trực quan chia theo tỷ lệ phần trăm các từ vựng thuộc 4 trạng thái:
  - 🟢 **Đã thuộc**: Những từ học sinh đã nắm vững.
  - 🔴 **Cần ôn lại**: Những từ học sinh đánh dấu cần xem kỹ lại.
  - 🔵 **Đang học**: Những từ đang trong quá trình ghi nhớ qua Flashcard/Quiz.
  - ⚪ **Chưa học**: Các từ mới chưa tương tác.
- **Khối lối tắt học tập (Action Spotlight)**: 3 thẻ điều hướng nhanh dẫn tới: *Học với Thẻ ghi nhớ*, *Luyện tập trắc nghiệm & Gõ từ*, và *Bài học Ngữ pháp*.
- **Tính năng Đặt lại tiến độ (Reset Progress)**: Cung cấp modal xác nhận an toàn cho phép học sinh làm mới toàn bộ tiến trình học tập khi muốn ôn luyện lại từ đầu.

#### 📖 B. Kho Từ Vựng Trọng Tâm (Vocabulary Archive & Filter Hub)
- **Thanh tìm kiếm tức thì (Live Search)**: Tìm kiếm đồng thời theo từ tiếng Anh, từ đồng nghĩa, nghĩa tiếng Việt hoặc từ khóa xuất hiện trong câu ví dụ.
- **Hệ thống lọc đa chiều (Multi-dimensional Filters)**:
  - *Lọc theo Unit*: Tất cả | Unit 7 | Unit 8.
  - *Lọc theo Từ loại (POS)*: Tất cả | Danh từ (N) | Động từ (V) | Tính từ (Adj) | Khác.
  - *Lọc theo Trạng thái*: Tất cả trạng thái | Đã thuộc | Cần ôn lại | Đang học | Chưa học.
- **Thẻ từ vựng chi tiết ([VocabCard.tsx](file:///client/src/components/vocabulary/VocabCard.tsx))**:
  - Tên từ nổi bật kèm biểu tượng loa phát âm tiếng Anh chuẩn thông qua Web Speech API.
  - Thẻ phân loại Unit, Từ loại và Từ đồng nghĩa (ví dụ: `=repair`).
  - Nghĩa tiếng Việt rõ ràng, kèm hộp câu ví dụ song ngữ bám sát bài học.
  - Hộp ghi chú phân biệt ngữ cảnh (ví dụ: phân biệt *border* và *boundary*).
  - Hai nút thao tác nhanh: **"Cần ôn lại"** và **"Đánh dấu thuộc"**.

#### 🗂️ C. Trình Thẻ Ghi Nhớ 3D (Interactive 3D Flashcards)
- **Trải nghiệm lật thẻ không gian 3 chiều**:
  - *Mặt trước*: Từ vựng tiếng Anh cỡ lớn, từ loại, nút nghe phát âm và gợi ý phím tắt.
  - *Mặt sau*: Định nghĩa tiếng Việt, câu ví dụ song ngữ và ghi chú ngữ cảnh mở rộng.
- **Hỗ trợ thao tác kép**:
  - Trên máy tính: Dùng phím `Space` để lật thẻ, phím `1` để đánh dấu *Cần ôn lại*, phím `2` để đánh dấu *Đã thuộc*, mũi tên `←` / `→` để chuyển thẻ.
  - Trên điện thoại/máy tính bảng: Chạm ngón tay trực tiếp vào bề mặt thẻ để lật, chạm các nút bấm lớn ở cạnh dưới màn hình.
- **Bộ lọc thẻ chuyên sâu**: Chế độ *Chỉ từ cần ôn* giúp học sinh tập trung tối đa vào các từ mình chưa nhớ vững; nút *Xáo trộn (Shuffle)* đảo ngẫu nhiên thứ tự để tránh học vẹt.
- **Màn hình hoàn thành (Deck Complete)**: Bắn pháo hoa ăn mừng (Canvas Confetti) khi học sinh hoàn thành toàn bộ lượt thẻ kèm nút *Học lại từ đầu* hoặc chuyển sang *Làm bài kiểm tra*.

#### ✍️ D. Phòng Luyện Tập & Đánh Giá Phản Xạ (Active Recall Quiz)
- **Tùy biến bài kiểm tra**:
  - Chọn 1 trong 2 hình thức: **Trắc nghiệm 4 đáp án** hoặc **Luyện gõ từ vựng (Spelling Challenge)**.
  - Chọn phạm vi ôn tập: Tất cả (58 từ), Unit 7, hoặc Unit 8.
  - Chọn số lượng câu: 5, 10, 15, hoặc 20 câu.
- **Cơ chế chống học vẹt**: Các đáp án nhiễu trong câu trắc nghiệm được lấy từ chính danh sách 58 từ của bài học, kích thích tư duy phân biệt nghĩa của học sinh.
- **Chế độ kiểm tra chính tả**: Học sinh đọc nghĩa tiếng Việt và câu ví dụ khuyết từ, tự tay gõ lại từ tiếng Anh; hệ thống kiểm tra độ chính xác từng ký tự.
- **Phản hồi tức thì**: Thông báo kết quả ngay sau mỗi câu trả lời (*"Chính xác!"* hoặc *"Chưa chính xác! Đáp án đúng: ..."*), tự động cập nhật độ thành thạo vào tiến độ học tập.

#### 📚 E. Hệ Thống Bài Học & Luyện Tập Ngữ Pháp (Grammar Hub & Drills)
- **11 Chủ điểm bài học toàn diện**:
  - *Unit 7*: Superlative Adjectives, Future with *will* vs. *be going to*, Requests with *Can/Could/Will/Would*, Modals of ability (*can/could/be able to*), Speaking strategies, Reading strategies.
  - *Unit 8*: Present Perfect with *ever/never*, Present Perfect with *for/since*, *There was/were* & *There has/have been*, WH-Questions in the Past, Likes and Dislikes with Gerunds/Infinitives.
- **Giao diện bài học 2 Tab chuyên biệt**:
  - **Tab 1: Lý thuyết & Công thức**: Hiển thị bảng ma trận quy tắc, công thức ngữ pháp dạng khối code, các trường hợp ngoại lệ và danh sách câu ví dụ trích xuất nguyên bản từ tài liệu.
  - **Tab 2: Bài tập vận dụng**: Các câu hỏi điền từ và chọn đáp án được trích xuất trực tiếp từ các câu thực hành trong tài liệu gốc. Có hệ thống chấm điểm tự động và trích dẫn câu gốc đối chiếu.
- **Nút đánh dấu hoàn thành**: Giúp học sinh chủ động theo dõi bài học nào mình đã nắm vững lý thuyết.

---

## 🛠️ Công Nghệ & Tiêu Chuẩn Lập Trình

Dự án tuân thủ nghiêm ngặt các quy tắc lập trình sạch và chuẩn giao diện hiện đại:
- **Framework & Core**: React 19, TypeScript (Strict mode, zero `any`), Vite.
- **Styling**: Tailwind CSS với bộ design tokens tùy biến (Warm monochrome, spot pastels, concentric borders).
- **Bộ icon tối giản**: Toàn bộ icon được viết dưới dạng mã SVG thuần túy (1.35px stroke) trong [`Icons.tsx`](file:///client/src/components/ui/Icons.tsx), không dùng thư viện icon cồng kềnh bên ngoài.
- **An toàn bảo mật tuyệt đối (Zero-XSS)**: Không sử dụng `dangerouslySetInnerHTML`. Thành phần [`FormattedText.tsx`](file:///client/src/components/ui/FormattedText.tsx) phân tích cú pháp Markdown an toàn thành cây React Element (`<strong>`, `<em>`).
- **Trình biên dịch dữ liệu tự động**: Kịch bản [`scripts/parse-markdown.mjs`](file:///scripts/parse-markdown.mjs) tự động chuyển đổi 2 file Markdown nguồn thành file JSON có kiểu dữ liệu đầy đủ tại thời điểm build.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu cầu môi trường
- **Node.js**: Phiên bản 18 trở lên
- **npm**: Phiên bản 9 trở lên

### 1. Cài đặt các gói phụ thuộc
Tại thư mục gốc của dự án:
```bash
npm --prefix client install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Lệnh này sẽ tự động:
1. Chạy parser trích xuất dữ liệu từ các file `.md`.
2. Khởi chạy máy chủ Vite tại địa chỉ `http://localhost:5173`.

### 3. Đóng gói cho môi trường thực tế (Production Build)
```bash
npm run build
```
Kiểm tra bản build sản phẩm với lệnh:
```bash
npm run preview
```

---

## 📝 Hướng Dẫn Thêm Hoặc Cập Nhật Nội Dung Bài Học

Bạn không cần phải sửa đổi code React hay TypeScript khi muốn cập nhật bài học, chỉ cần chỉnh sửa trực tiếp 2 file Markdown ở thư mục gốc:

1. **Cập nhật Từ vựng**:
   - Mở file [`Vocabulary_Units_7_8.md`](file:///Vocabulary_Units_7_8.md).
   - Thêm hoặc sửa từ vựng theo cú pháp chuẩn:
     ```markdown
     - **Từ_Vựng** (Loại_Từ): Nghĩa tiếng Việt
       *Ex: Câu ví dụ tiếng Anh. (Dịch nghĩa câu ví dụ.)*
     ```
   - Nếu có từ đồng nghĩa: `- **Word** (POS) (=synonym): Nghĩa tiếng Việt...`
   - Nếu có lưu ý ngữ cảnh: Thêm dòng `> **Lưu ý:** Nội dung lưu ý...` ngay sau mục từ.

2. **Cập nhật Ngữ pháp**:
   - Mở file [`Grammar_Summary_Units_7_8.md`](file:///Grammar_Summary_Units_7_8.md).
   - Thêm hoặc cập nhật tiêu đề bài học (`### Tiêu đề`), bảng công thức (`| Cột 1 | Cột 2 |`), hoặc các gạch đầu dòng ví dụ.

3. **Cập nhật dữ liệu vào ứng dụng**:
   - Chạy lệnh sau để dữ liệu mới được đồng bộ vào website:
     ```bash
     npm run parse
     ```
   - (Nếu đang chạy `npm run dev` hoặc `npm run build`, bước này sẽ được tự động thực hiện).