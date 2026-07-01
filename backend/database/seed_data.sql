-- ========================================================
-- CHÈN DỮ LIỆU MẪU (SEED DATA) CHO PYTHON AI LEARNING
-- ========================================================
USE python_ai_learning_db;

-- Ngắt kiểm tra để đảm bảo quá trình chèn chuỗi sạch không bị kẹt ngắt quãng
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;
DELETE FROM `admin_audit_logs`;
DELETE FROM `notifications`;
DELETE FROM `contact_messages`;
DELETE FROM `learning_activities`;
DELETE FROM `lesson_progress`;
DELETE FROM `enrollments`;
DELETE FROM `quiz_attempt_answers`;
DELETE FROM `quiz_attempts`;
DELETE FROM `quiz_options`;
DELETE FROM `quiz_questions`;
DELETE FROM `quizzes`;
DELETE FROM `ai_retrieval_logs`;
DELETE FROM `ai_chat_messages`;
DELETE FROM `ai_chat_sessions`;
DELETE FROM `transcript_chunks`;
DELETE FROM `lesson_summaries`;
DELETE FROM `lesson_transcripts`;
DELETE FROM `lesson_videos`;
DELETE FROM `lessons`;
DELETE FROM `course_sections`;
DELETE FROM `courses`;
DELETE FROM `user_settings`;
DELETE FROM `password_reset_tokens`;
DELETE FROM `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- NHÓM 1: NGƯỜI DÙNG VÀ TÀI KHOẢN
-- --------------------------------------------------------

-- Chèn dữ liệu bảng users (Password giả lập đã được băm mã hóa)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `phone`, `full_name`, `avatar_url`, `role`, `status`) VALUES
(1, 'admin_system', 'admin@pythonailearning.edu.vn', '$2b$12$K399E9m77pG/gO2p2H4EKe7rL7WjFz5O7U8eR3Y9gB.yR2J2gGzG.', '0905111222', 'Nguyễn Quản Trị', 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin', 'admin', 'active'),
(2, 'thinh_tran', 'thinhnguyen@student.edu.vn', '$2b$12$K399E9m77pG/gO2p2H4EKe7rL7WjFz5O7U8eR3Y9gB.yR2J2gGzG.', '0905333444', 'Trần Kim Thịnh', 'https://api.dicebear.com/7.x/adventurer/svg?seed=thinh', 'student', 'active'),
(3, 'huydz252', '252quanghuy@gmail.com', '$2a$10$dE4mjbVp6aBiT7eBeWXA/ehS3dKvCkOJ0LsFzj3WhwmOxF80.i0p.', '0813118974', 'Trần Quang Huy', 'https://api.dicebear.com/7.x/adventurer/svg?seed=huy', 'student', 'active'),
(4, 'tien_nguyen', 'tiennguyen@student.edu.vn', '$2b$12$K399E9m77pG/gO2p2H4EKe7rL7WjFz5O7U8eR3Y9gB.yR2J2gGzG.', '0905777888', 'Tiến Nguyễn', 'https://api.dicebear.com/7.x/adventurer/svg?seed=nguyen', 'student', 'active');

-- Chèn dữ liệu cấu hình mặc định user_settings
INSERT INTO `user_settings` (`id`, `user_id`, `two_factor_enabled`, `save_ai_history`, `learning_reminder_enabled`, `theme`) VALUES
(1, 1, 1, 1, 0, 'dark'),
(2, 2, 0, 1, 1, 'system'),
(3, 3, 0, 1, 1, 'light'),
(4, 4, 0, 0, 1, 'system');


-- --------------------------------------------------------
-- NHÓM 2: KHÓA HỌC, CHƯƠNG, BÀI HỌC VÀ VIDEO
-- --------------------------------------------------------

-- Chèn dữ liệu bảng courses
INSERT INTO `courses` (`id`, `title`, `slug`, `description`, `thumbnail_url`, `level`, `price`, `status`, `created_by`) VALUES
(1, 'Lập trình Python Cơ Bản tích hợp AI', 'python-co-ban-tich-hop-ai', 'Khóa học nền tảng giúp làm quen với tư duy lập trình Python và ứng dụng AI Assistant vào tối ưu hóa hiệu suất viết code.', 'https://storage.googleapis.com/python-ai-assets/thumbnails/python-basic.png', 'beginner', 0.00, 'published', 1),
(2, 'Xây dựng Hệ thống Trợ lý thông minh RAG với FastAPI', 'rag-fastapi-advanced', 'Khóa học nâng cao hướng dẫn thiết kế toàn diện hệ thống RAG kết hợp cơ sở dữ liệu Vector và Python FastAPI.', 'https://storage.googleapis.com/python-ai-assets/thumbnails/fastapi-rag.png', 'advanced', 499000.00, 'published', 1);

-- Chèn dữ liệu cấu trúc chương học course_sections
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `sort_order`) VALUES
(1, 1, 'Chương I: Mở đầu và Thiết lập môi trường', 1),
(2, 1, 'Chương II: Cấu trúc dữ liệu cốt lõi trong Python', 2),
(3, 2, 'Chương I: Kiến trúc hệ thống RAG tổng quan', 1);

-- Chèn danh sách bài học chi tiết lessons
INSERT INTO `lessons` (`id`, `course_id`, `section_id`, `title`, `description`, `duration_seconds`, `sort_order`, `is_free`, `status`) VALUES
(1, 1, 1, 'Bài 1: Cài đặt Python 3 và Anaconda Navigator', 'Hướng dẫn chi tiết quy trình cấu hình công cụ học tập trên Windows và MacOS.', 600, 1, 1, 'published'),
(2, 1, 1, 'Bài 2: Viết chương trình Hello World tiên phong', 'Làm quen với cú pháp, hàm print và cách thực thi file script python.', 450, 2, 1, 'published'),
(3, 1, 2, 'Bài 3: Thao tác nâng cao với List và Dictionary', 'Làm chủ hai cấu trúc dữ liệu xuất hiện nhiều nhất khi xử lý logic trong Python.', 1200, 1, 0, 'published'),
(4, 2, 3, 'Bài 1: Cơ chế nhúng văn bản (Embedding) và Kho lưu trữ ChromaDB', 'Tìm hiểu cách chuyển hóa dữ liệu dạng text sang các chuỗi mảng vector số học.', 1800, 1, 0, 'published');

-- Chèn dữ liệu lưu trữ video liên kết lesson_videos
INSERT INTO `lesson_videos` (`id`, `lesson_id`, `video_url`, `storage_provider`, `file_name`, `file_size`, `duration_seconds`, `processing_status`) VALUES
(1, 1, 'https://watch.cloudflarestream.com/v_py001_setup', 'Cloudflare', 'python_setup_guide.mp4', 45890000, 600, 'completed'),
(2, 2, 'https://watch.cloudflarestream.com/v_py002_hello', 'Cloudflare', 'hello_world_final.mp4', 21100000, 450, 'completed'),
(3, 3, 'https://watch.cloudflarestream.com/v_py003_datastruct', 'Cloudflare', 'list_dict_deepdive.mp4', 98500000, 1200, 'completed'),
(4, 4, 'https://watch.cloudflarestream.com/v_rag001_vector', 'Cloudflare', 'embedding_chromadb.mp4', 154000000, 1800, 'completed');


-- --------------------------------------------------------
-- NHÓM 3: TRANSCRIPT, TÓM TẮT VÀ DỮ LIỆU AI PIPELINE
-- --------------------------------------------------------

-- Chèn văn bản bóc tách từ video sang bảng lesson_transcripts
INSERT INTO `lesson_transcripts` (`id`, `lesson_id`, `transcript_text`, `language`, `generated_by`, `status`) VALUES
(1, 1, 'Chào mừng các bạn đến với hệ thống Python AI Learning. Hôm nay chúng ta sẽ cùng nhau thực hiện các bước tải xuống ứng dụng Python phiên bản mới nhất từ trang chủ python.org và triển khai bộ công cụ Anaconda giúp quản lý thư viện khoa học dữ liệu.', 'vi', 'Faster-Whisper-LargeV3', 'completed'),
(2, 2, 'Xin chào các học viên. Bài học này chúng ta sẽ viết dòng mã lệnh đầu tiên. Các bạn tạo file mới đặt tên là main.py và nhập dòng lệnh print bọc chuỗi ký tự Hello World nằm bên trong cặp dấu nháy kép.', 'vi', 'Faster-Whisper-LargeV3', 'completed');

-- Chèn bản tóm tắt nội dung chính sinh bởi AI lesson_summaries
INSERT INTO `lesson_summaries` (`id`, `lesson_id`, `summary_text`, `key_points`, `generated_by`) VALUES
(1, 1, 'Bài học tập trung giải quyết thao tác cài đặt môi trường lập trình Python chuẩn hóa bao gồm phân phối lõi và trình quản lý phân vùng gói Anaconda.', '["Truy cập trang chủ tải bản ổn định", "Tích hợp biến môi trường PATH hệ thống", "Khởi động kiểm tra bằng terminal"]', 'GPT-4o-Mini'),
(2, 2, 'Giới thiệu sơ khởi về hàm built-in print dùng để xuất dữ liệu văn bản ra màn hình bảng điều khiển console khi khởi chạy.', '["Sử dụng đuôi mở rộng file .py", "Cú pháp gọi hàm truyền đối số", "Chạy chương trình bằng câu lệnh python name.py"]', 'GPT-4o-Mini');

-- Chèn dữ liệu phân mảnh định danh đồng bộ với Vector DB transcript_chunks
INSERT INTO `transcript_chunks` (`id`, `lesson_id`, `transcript_id`, `chunk_index`, `chunk_text`, `vector_id`) VALUES
(1, 1, 1, 0, 'Chào mừng các bạn đến với hệ thống Python AI Learning. Hôm nay chúng ta sẽ cùng nhau thực hiện các bước tải xuống ứng dụng Python', 'vec_chunk_001_0'),
(2, 1, 1, 1, 'phiên bản mới nhất từ trang chủ python.org và triển khai bộ công cụ Anaconda giúp quản lý thư viện khoa học dữ liệu.', 'vec_chunk_001_1'),
(3, 2, 2, 0, 'Xin chào các học viên. Bài học này chúng ta sẽ viết dòng mã lệnh đầu tiên. Các bạn tạo file mới đặt tên là main.py', 'vec_chunk_002_0');


-- --------------------------------------------------------
-- NHÓM 4: AI ASSISTANT VÀ LỊCH SỬ CHAT
-- --------------------------------------------------------

-- Chèn phiên làm việc hội thoại ai_chat_sessions
INSERT INTO `ai_chat_sessions` (`id`, `user_id`, `course_id`, `lesson_id`, `title`) VALUES
(1, 2, 1, 1, 'Hỏi về lỗi không nhận diện lệnh python'),
(2, 3, 1, 2, 'Tìm hiểu sâu về cơ chế nháy đơn và nháy kép');

-- Chèn tin nhắn hội thoại ai_chat_messages
INSERT INTO `ai_chat_messages` (`id`, `session_id`, `sender`, `message_text`, `model_name`) VALUES
(1, 1, 'user', 'Mình gõ lệnh python trong cmd báo lỗi "not recognized" thì xử lý sao ạ?', NULL),
(2, 1, 'assistant', 'Lỗi này xuất hiện do bạn chưa thêm đường dẫn cài đặt Python vào biến môi trường Environment Variables (PATH). Hãy tích chọn ô "Add Python to PATH" lúc chạy lại file cài đặt nhé.', 'Qwen2.5-Coder-7B'),
(3, 2, 'user', 'Trong Python dùng dấu nháy đơn hay nháy kép để bọc chuỗi thì tốt hơn?', NULL),
(4, 2, 'assistant', 'Trong Python, cặp nháy đơn và nháy kép có giá trị sử dụng tương đương nhau. Tuy nhiên, nếu chuỗi của bạn chứa dấu nháy đơn, hãy bọc ngoài bằng dấu nháy kép để tránh lỗi cú pháp.', 'Qwen2.5-Coder-7B');

-- Chèn log truy vết RAG ai_retrieval_logs
INSERT INTO `ai_retrieval_logs` (`id`, `message_id`, `chunk_id`, `similarity_score`) VALUES
(1, 2, 1, 0.8923),
(2, 4, 3, 0.7412);


-- --------------------------------------------------------
-- NHÓM 5: QUIZ VÀ KẾT QUẢ KIỂM TRA
-- --------------------------------------------------------

-- Chèn đề mục bài tập trắc nghiệm quizzes
INSERT INTO `quizzes` (`id`, `lesson_id`, `title`, `description`, `time_limit_seconds`, `status`) VALUES
(1, 2, 'Bài trắc nghiệm khởi động nhanh', 'Kiểm tra kiến thức cơ bản về cách khai báo chuỗi văn bản và gọi hàm xuất dữ liệu.', 300, 'published');

-- Chèn danh sách câu hỏi quiz_questions
INSERT INTO `quiz_questions` (`id`, `quiz_id`, `question_text`, `code_snippet`, `difficulty`, `explanation`, `sort_order`) VALUES
(1, 1, 'Hàm nào sau đây được dùng để in giá trị hoặc dữ liệu ra màn hình console trong Python?', NULL, 'easy', 'Hàm print() là hàm tích hợp sẵn (built-in) của ngôn ngữ Python để thực hiện xuất thông tin.', 1),
(2, 1, 'Đoạn mã lệnh sau đây có kết quả trả về là gì?', 'print("Python " + "AI")', 'easy', 'Phép toán toán tử dấu cộng (+) khi áp dụng trên hai đối tượng chuỗi văn bản sẽ thực thi hành động nối chuỗi nối tiếp nhau.', 2);

-- Chèn hệ thống đáp án lựa chọn quiz_options
INSERT INTO `quiz_options` (`id`, `question_id`, `option_label`, `option_text`, `is_correct`) VALUES
(1, 1, 'A', 'echo()', 0),
(2, 1, 'B', 'print()', 1),
(3, 1, 'C', 'console.log()', 0),
(4, 1, 'D', 'System.out.println()', 0),
(5, 2, 'A', 'Python AI', 1),
(6, 2, 'B', 'Python+AI', 0),
(7, 2, 'C', 'Lỗi cú pháp hệ thống', 0);

-- Chèn lượt làm bài kiểm tra quiz_attempts
INSERT INTO `quiz_attempts` (`id`, `quiz_id`, `user_id`, `total_questions`, `correct_answers`, `score`, `started_at`, `submitted_at`) VALUES
(1, 1, 2, 2, 2, 10.00, '2026-06-25 09:00:00', '2026-06-25 09:02:15'),
(2, 1, 3, 2, 1, 5.00, '2026-06-25 09:15:00', '2026-06-25 09:18:40');

-- Chèn chi tiết các phương án do người dùng click chọn quiz_attempt_answers
INSERT INTO `quiz_attempt_answers` (`id`, `attempt_id`, `question_id`, `selected_option_id`, `is_correct`) VALUES
(1, 1, 1, 2, 1), -- Thịnh chọn câu 1 đáp án B (Đúng)
(2, 1, 2, 5, 1), -- Thịnh chọn câu 2 đáp án A (Đúng)
(3, 2, 1, 2, 1), -- Huy chọn câu 1 đáp án B (Đúng)
(4, 2, 2, 6, 0); -- Huy chọn câu 2 đáp án B (Sai)


-- --------------------------------------------------------
-- NHÓM 6: ĐĂNG KÝ KHÓA HỌC VÀ TIẾN ĐỘ HỌC TẬP
-- --------------------------------------------------------

-- Chèn ghi nhận lượt tham gia học tập enrollments
INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `status`, `enrolled_at`, `completed_at`) VALUES
(1, 2, 1, 'active', '2026-06-20 08:30:00', NULL),
(2, 3, 1, 'active', '2026-06-21 14:00:00', NULL),
(3, 4, 1, 'completed', '2026-06-15 09:00:00', '2026-06-24 17:30:00');

-- Chèn tiến trình phân tích thời lượng xem video bài học lesson_progress
INSERT INTO `lesson_progress` (`id`, `user_id`, `lesson_id`, `watched_seconds`, `is_completed`, `completed_at`) VALUES
(1, 2, 1, 600, 1, '2026-06-22 10:15:00'),
(2, 2, 2, 120, 0, NULL),
(3, 3, 1, 450, 0, NULL);


-- --------------------------------------------------------
-- NHÓM 7: HOẠT ĐỘNG, LIÊN HỆ, THÔNG BÁO VÀ AUDIT
-- --------------------------------------------------------

-- Chèn dòng thời gian hoạt động tương tác hệ thống learning_activities
INSERT INTO `learning_activities` (`id`, `user_id`, `activity_type`, `title`, `description`, `related_course_id`, `related_lesson_id`, `related_quiz_id`, `action_url`) VALUES
(1, 2, 'video', 'Hoàn thành xem video', 'Đã xem trọn vẹn thời lượng bài hướng dẫn cài đặt môi trường.', 1, 1, NULL, '/learning/1/1'),
(2, 2, 'quiz', 'Nộp bài trắc nghiệm', 'Đạt điểm số tuyệt đối 10.00 tại Bài trắc nghiệm khởi động nhanh.', 1, 2, 1, '/quiz/2/result'),
(3, 2, 'ai', 'Đặt câu hỏi cho Trợ lý ảo AI', 'Yêu cầu hỗ trợ gỡ rối lỗi cấu hình PATH biến hệ thống.', 1, 1, NULL, '/ai-assistant');

-- Chèn thông tin hòm thư góp ý contact_messages
INSERT INTO `contact_messages` (`id`, `full_name`, `email`, `phone`, `subject`, `message`, `status`) VALUES
(1, 'Trần Minh Hoàng', 'hoangtm@gmail.com', '0914999888', 'Hỏi về lộ trình Python AI', 'Chào ban quản trị, cho mình hỏi khóa học RAG FastAPI có yêu cầu kiến thức nền tảng gì quá sâu không ạ?', 'new');

-- Chèn trung tâm thông báo đẩy nhanh notifications
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `type`, `is_read`) VALUES
(1, 2, 'Hệ thống AI xử lý hoàn tất!', 'Video bài học số 3 của bạn đã được bóc tách dữ liệu transcript và tóm tắt thành công.', 'ai_pipeline', 0),
(2, 3, 'Khuyến mãi khóa học mới', 'Giảm giá ngay 20% khi đăng ký khóa chuyên sâu RAG trong tuần này.', 'promotion', 1);

-- Chèn nhật ký hành động phân quyền nội bộ admin_audit_logs
INSERT INTO `admin_audit_logs` (`id`, `admin_id`, `action`, `target_table`, `target_id`, `description`) VALUES
(1, 1, 'create', 'courses', 2, 'Khởi tạo cấu trúc khóa nâng cao RAG FastAPI trên môi trường production.'),
(2, 1, 'process_ai', 'lesson_videos', 4, 'Kích hoạt pipeline AI trích xuất nội dung từ video bài học số 4.');