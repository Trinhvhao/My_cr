// Biến này được sử dụng để theo dõi giá trị Z-index cao nhất của các tờ giấy,
// Mỗi khi một tờ giấy được nhấp, giá trị Z-index của nó sẽ được đặt bằng giá trị highestZ, sau đó highestZ sẽ tăng lên 1.
let highestZ = 1;
class Paper {
  // Xác định xem tờ giấy có đang được giữ hay không. Khi giữ tờ giấy, giá trị là true, khi không giữ là false.
  holdingPaper = false;
  // Là tọa độ X và Y của chuột khi người dùng bắt đầu giữ tờ giấy.  Được sử dụng để tính toán hướng di chuyển của chuột khi tờ giấy đang được giữ.
  mouseTouchX = 0;
  mouseTouchY = 0;
  // Lưu trữ tọa độ x và y của chuột tại mỗi thời điểm khi sự kiện mousemove xảy ra.
  mouseX = 0;
  mouseY = 0;
  // Lưu trữ tọa độ x và y của chuột trong lần di chuyển trước đó. Được sử dụng để tính toán tốc độ di chuyển của chuột.
  prevMouseX = 0;
  prevMouseY = 0;
  // Lưu trữ tốc độ di chuyển của chuột theo hai chiều x và y.
  // Được tính toán bằng cách lấy sự chênh lệch giữa tọa độ hiện tại và tọa độ trước đó của chuột chia cho thời gian chênh lệch
  velX = 0;
  velY = 0;
  // Được khởi tạo với một giá trị ngẫu nhiên trong khoảng từ -15 đến 15 độ. Đây là góc quay của tờ giấy. Sử dụng hàm random
  rotation = Math.random() * 30 - 15;
  // Được khởi tạo với một giá trị ngẫu nhiên trong khoảng từ -15 đến 15 độ. Đây là góc quay của tờ giấy.
  currentPaperX = 0;
  currentPaperY = 0;
  // Biểu thị trạng thái của việc quay tờ giấy. Khi đang quay (true), các sự kiện di chuyển chuột sẽ ảnh hưởng đến góc quay của tờ giấy.
  rotating = false;

  init(paper) {
    // Sự kiện này xảy ra khi chuột di chuyển trên trang web
    document.addEventListener("mousemove", (e) => {
      // Nếu như không đang trong trạng thái quay, cập nhập toạ độ chuột và tốc độ di chuyển
      if (!this.rotating) {
        // clientX và clientY là thuộc tính của sự kiện chuột trong JavaScript, chúng đều cung cấp tọa độ của chuột khi sự kiện diễn ra.
        // cập nhật toạ độ của chuột
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Tính toán tốc độ của chuột
        // Tính toán tốc độ di chuyển giúp tờ giấy di chuyển mượt mà theo chuột.
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
      // Tính toán hướng vector từ vị trí đầu tiên khi giữ chuột đến vị trí hiện tại
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;

      // công thức tính độ dài vector
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      // tính thành phần x,y chuẩn hóa của vector.
      // Chuẩn hóa vector là quá trình biến đổi vector ban đầu thành một vector có độ dài bằng 1, giữ nguyên hướng của vector.
      // Mục đích của việc chuẩn hoá vector trong ngữ cảnh này liên quan đến việc sử dụng hướng vector để xác định góc quay của một đối tượng
      // Chuẩn hóa vector giúp đơn giản hóa các tính toán và đảm bảo rằng độ dài của vector không ảnh hưởng đến hướng của nó.
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      // Tính góc quay dựa trên vector chuẩn hóa và chuyển đổi sang đơn vị độ
      // Hàm Math.atan2(y, x) trả về góc trong radian giữa trục x và một điểm (x, y) trong không gian hai chiều.
      // Trong trường hợp này, dirNormalizedY là toạ độ y của vector chuẩn hóa và dirNormalizedX là toạ độ x của vector chuẩn hóa.
      // Kết quả là góc (rad) giữa trục x và vector được biểu diễn bởi các toạ độ đã chuẩn hóa.
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      // Vì hàm 'math.atan2' trả về góc trong radian, dòng này chuyển đổi từ radian sang đơn vị độ bằng cách nhân với 180/pi
      let degrees = (180 * angle) / Math.PI;
      // Dòng này được sử dụng để chuẩn hóa góc để nằm trong khoảng từ 0 đến 359 độ.
      // Kết quả là góc quay được chuyển đổi và nằm trong khoảng từ 0 đến 359 độ.
      degrees = (360 + Math.round(degrees)) % 360;
      //Nếu đang trong trạng thái quay, cập nhật góc quay của tờ giấy
      if (this.rotating) {
        this.rotation = degrees;
      }
      // Nếu đang giữ tờ giấy, cập nhật vị trí của tờ giấy và áp dụng transform CSS
      if (this.holdingPaper) {
        if (!this.rotating) {
          // Nếu không quay và giữ từ giấy thì toạ độ tờ giấy sẽ được cập nhật .
          // Điều này tạo ra hiệu ứng di chuyển tờ giấy theo chuột khi người dùng giữ chuột và di chuyển nó.
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        // Lưu trữ toạ độ chuột hiện tại để sử dụng trong lần di chuyển tiếp theo.
        // Điều này giúp tính toán tốc độ di chuyển trong các lần di chuyển sau
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        // Cập nhật thuộc tính transform của CSS cho phần tờ giấy trên trang.
        // Sử dụng các giá trị translateX và translateY để di chuyển tờ giấy và rotateZ để quay tờ giấy theo góc rotation.
        // Các giá trị này được cập nhật dựa trên tốc độ di chuyển và góc quay của tờ giấy.
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Lắng nghe sự kiện mousedown trên tờ giấy
    paper.addEventListener("mousedown", (e) => {
      // Khi người dùng nhấn chuột trên tờ giâys, một hàm callback được gọi
      // Nếu người dùng giữ chuột trên tờ giấy và tiếp tục di chuyển chuột, sự kiện mousedown có thể liên tục xảy ra
      // Và hàm callback sẽ được gọi lại mỗi khi sự kiện này xảy ra.
      // Dòng mã 'if(this.holdingPaper) return; 'đảm bảo rằng nếu 'holdingPaper' đã có giá trị 'true', thì hàm sẽ kết thúc mà không thực hiện
     // . Điều này giúp tránh tình trạng thực hiện lặp lại không cần thiết của các thao tác.
      if (this.holdingPaper) return;
      // Nếu holdingPaper không phải là true (điều kiện trên không đúng), thì biến này sẽ được gán giá trị true.
      // Điều này đánh dấu rằng người dùng bắt đầu giữ chuột trên tờ giấy.
      this.holdingPaper = true;
      // Đặt giá trị' zIndex' của tờ giấy để đảm bảo tờ giấy hiển thị lên trên các phần tử khác
      //'highestZ' là một biến toàn cục được sử dụng để theo dõi giá trị 'zIndex' cao nhất được sử dụng và nó được tăng lên sau mỗi lần thực hiện mousedown
      // Ví dụ khi click vào paper thứ nhất thì nó được gán z-index=1 => hiển thị lên trên và biến highestZ tăng lên bằng 2
      // Khi người dùng click paper khác thì z-index cho tờ đó lại được gán = biến highestZ lúc này bằng 2 và paper hiện lên trước paper trước đó
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Kiểm tra xem người dùng nhấn chuột trái (button 0) hay không.
      if (e.button === 0) {
        // Gán giá trị của this.mouseX (toạ độ x hiện tại của chuột) cho this.mouseTouchX.
        this.mouseTouchX = this.mouseX;
        // Gán giá trị của this.mouseY (toạ độ y hiện tại của chuột) cho this.mouseTouchY.
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      // Kiểm tra xem người dùng nhấn chuột phải (button 2) hay không. Chỉ khi sử dụng chuột phải mới có thể quay
      if (e.button === 2) {
        // Nếu đúng, đặt giá trị true cho biến rotating, đánh dấu rằng tờ giấy đang trong trạng thái quay.
        this.rotating = true;
      }
    });
    // Sự kiện xảy ra khi người dùng nhả chuột
    window.addEventListener("mouseup", () => {
      // Khi sự kiện này xảy ra, gán giá trị false cho holdingPaper và rotating, đồng thời kết thúc trạng thái giữ chuột và quay tờ giấy.
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

// Đoạn mã này thực hiện việc lấy tất cả các phần tử có lớp "paper" từ trang web, tạo đối tượng Paper cho mỗi phần tử này, và khởi tạo chúng bằng cách gọi phương thức init(paper). 
// Điều này có thể được sử dụng để thêm tính năng tương tác với các "tờ giấy" trên trang web.
const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
