USE python_ai_learning_db;

-- ========================================================
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `hashed_password`, `full_name`, `avatar_url`, `role`) VALUES
(1, 'admin', 'admin@pythonai.vn', 'admin123', 'Quản Trị Viên Hệ Thống', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'admin'),
(2, 'nguyen_van_a', 'nguyen.vana@example.com', 'student123', 'Nguyễn Văn A', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'student');


-- ========================================================
INSERT IGNORE INTO `courses` (`id`, `title`, `description`, `thumbnail_url`, `level`, `is_published`) VALUES
(1, 'Python Cơ Bản Cho Người Mới Bắt Đầu', 'Khóa học giúp học viên nắm vững cú pháp Python, biến, kiểu dữ liệu, điều kiện, vòng lặp, hàm và các ví dụ thực hành thông qua hệ thống học tập AI tiên tiến nhất.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', 'basic', 1),
(2, 'Phân tích dữ liệu với AI', 'Học cách ứng dụng machine learning và các mô hình AI để xử lý dữ liệu thực tế chuyên sâu.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', 'intermediate', 1),
(3, 'Lập trình Web với Django & AI', 'Xây dựng các ứng dụng web mạnh mẽ và tích hợp các tính năng thông minh bằng Django framework.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 'intermediate', 1),
(4, 'Deep Learning & Computer Vision', 'Chinh phục những công nghệ AI phức tạp nhất hiện nay trong lĩnh vực thị giác máy tính.', 'https://images.unsplash.com/photo-1677442136019-21780efad99a', 'advanced', 1);


-- ========================================================
INSERT IGNORE INTO `chapters` (`id`, `course_id`, `title`, `order_index`) VALUES
(1, 1, 'Chương 1: Giới thiệu về Python', 1),
(2, 1, 'Chương 2: Biến và Kiểu dữ liệu', 2),
(3, 1, 'Chương 3: Cấu trúc điều khiển & Vòng lặp', 3);


-- ========================================================
INSERT IGNORE INTO `lessons` (`id`, `chapter_id`, `title`, `video_url`, `code_stub`, `transcript`, `order_index`) VALUES
(1, 1, 'Bài 1: Giới thiệu về Python', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '# Bài 1: Cài đặt\nprint("Hello Python AI")', 'Chào mừng các bạn đã quay trở lại với khóa học Python AI Learning. Trong bài học ngày hôm nay, chúng ta sẽ cùng nhau tìm hiểu khái niệm cực kỳ quan trọng trong lập trình...', 1),
(2, 2, 'Bài 2: Biến và Kiểu dữ liệu', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', '# Bài 2: Biến\nx = 5\ny = "Hello"', 'Trong bài này chúng ta sẽ nghiên cứu về cách khai báo biến số, các kiểu dữ liệu nguyên thủy như số nguyên integer, chuỗi ký tự string, kiểu số thực float cũng như mảng danh sách list và tuple trong Python...', 1),
(3, 3, 'Bài 3: Cấu trúc điều kiện If-Else', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', '# Bài 3: Điều kiện\nif x > 0:\n    print("Số dương")', 'Cấu trúc rẽ nhánh điều kiện giúp chương trình đưa ra quyết định dựa trên các phép toán so sánh logic đúng sai...', 1),
(4, 3, 'Bài 4: Vòng lặp trong Python', 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '# lesson_04.py\nfor student in classroom:\n    student.learn("Python")', 'Chào mừng các bạn đã quay trở lại với khóa học Python AI Learning. Trong bài học ngày hôm nay, chúng ta sẽ cùng nhau tìm hiểu khái niệm cực kỳ quan trọng trong lập trình: Vòng lặp. Vòng lặp giúp chúng ta thực thi một đoạn mã nhiều lần mà không cần viết lại. Thường được sử dụng để duyệt qua các phần tử của một tập hợp như list, tuple, string hoặc sử dụng hàm range(). Cấu trúc của nó rất tinh gọn và dễ hiểu, đúng theo triết lý của Python. Khác với for, vòng lặp while sẽ tiếp tục chạy chừng nào điều kiện còn đúng (True). Đây là loại vòng lặp linh hoạt nhưng cần cẩn thận để tránh lỗi vòng lặp vô tận (infinite loop). Cuối cùng, chúng ta sẽ đặt lên bàn cân khi nào nên dùng for và khi nào nên dùng while.', 2);


-- ========================================================
INSERT IGNORE INTO `video_jobs` (`id`, `lesson_id`, `status`, `progress`, `error_message`, `started_at`, `completed_at`) VALUES
(1, 1, 'completed', 100, NULL, '2026-06-24 08:00:00', '2026-06-24 08:05:00'),
(2, 2, 'completed', 100, NULL, '2026-06-24 08:10:00', '2026-06-24 08:15:00'),
(3, 3, 'pending', 0, NULL, NULL, NULL),
(4, 4, 'processing', 45, NULL, '2026-06-24 09:20:00', NULL);


-- ========================================================
INSERT IGNORE INTO `chat_sessions` (`id`, `user_id`, `lesson_id`, `created_at`) VALUES
(1, 2, 4, '2026-06-24 09:22:00');


-- ========================================================
INSERT IGNORE INTO `chat_messages` (`id`, `session_id`, `sender`, `message`, `created_at`) VALUES
(1, 1, 'ai', 'Chào bạn! Tôi là AI Assistant. Bạn có thắc mắc gì về cách hoạt động của vòng lặp for trong đoạn mã phút 03:45 không?', '2026-06-24 09:22:05'),
(2, 1, 'user', 'Bạn có thể giải thích lại sự khác biệt giữa for và while một cách ngắn gọn được không?', '2026-06-24 09:23:10'),
(3, 1, 'ai', 'Tất nhiên! Hãy nhớ:\n- For: Dùng để duyệt qua một danh sách (list, string, range) khi bạn đã biết trước số lần lặp.\n- While: Dùng khi bạn chỉ quan tâm đến một điều kiện đúng/sai, vòng lặp sẽ chạy liên tục cho đến khi điều kiện đó không còn đúng nữa.', '2026-06-24 09:23:15');