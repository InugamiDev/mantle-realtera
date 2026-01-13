import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { GlassCard } from "@/components/realtera/GlassCard";

export default function SponsorshipPage() {
  const canDo = [
    "Hiển thị ưu tiên trong cùng xếp hạng (ví dụ: dự án sponsor hạng B xuất hiện trước các dự án hạng B khác)",
    "Gắn nhãn 'Sponsored' để người dùng nhận biết",
    "Xuất hiện trong phần quảng cáo riêng (nếu có)",
  ];

  const cannotDo = [
    "Thay đổi xếp hạng hoặc điểm số của dự án",
    "Ẩn hoặc xóa đánh giá tiêu cực",
    "Thay đổi nội dung đánh giá và nhận xét",
    "Xuất hiện ở hạng cao hơn hạng thực tế",
    "Ẩn thông tin rủi ro của dự án",
    "Tắt nhãn 'Sponsored' trên giao diện",
  ];

  return (
    <div className="container-app py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại Bảng Xếp Hạng
      </Link>

      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">Chính sách Sponsor</h1>
        <p className="page-subtitle">
          Minh bạch về những gì sponsor có thể và không thể làm trên RealTera
        </p>
      </header>

      {/* Main content */}
      <div className="space-y-8">
        {/* Transparency commitment */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Cam kết minh bạch</h2>
          <p className="text-muted-foreground">
            RealTera hoạt động dựa trên nguyên tắc: <span className="font-medium text-foreground">thông tin trung thực
            không bao giờ bị mua bán</span>. Sponsor là hình thức hỗ trợ duy trì hoạt động của nền tảng,
            nhưng không bao giờ ảnh hưởng đến tính khách quan của đánh giá.
          </p>
        </GlassCard>

        {/* What sponsors can do */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Sponsor CÓ THỂ</h2>
          <ul className="space-y-3">
            {canDo.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-emerald-500/10 p-1">
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                </div>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* What sponsors cannot do */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Sponsor KHÔNG THỂ</h2>
          <ul className="space-y-3">
            {cannotDo.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-red-500/10 p-1">
                  <X className="h-4 w-4 text-red-600" aria-hidden="true" />
                </div>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Disclosure policy */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Chính sách công khai</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">1. Hiển thị rõ ràng:</span> Mọi dự án có sponsor
              đều được gắn nhãn &ldquo;Sponsored&rdquo; trên card và trang chi tiết. Nhãn này không bao giờ bị ẩn.
            </p>
            <p>
              <span className="font-medium text-foreground">2. Tooltip giải thích:</span> Khi người dùng
              click/hover vào nhãn Sponsored, sẽ thấy thông báo: &ldquo;Sponsor chỉ ảnh hưởng vị trí.
              Xếp hạng và điểm không đổi.&rdquo;
            </p>
            <p>
              <span className="font-medium text-foreground">3. Không phân biệt đánh giá:</span> Dự án sponsor
              và không sponsor được đánh giá theo cùng một tiêu chuẩn và quy trình.
            </p>
          </div>
        </GlassCard>

        {/* FAQ */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Câu hỏi thường gặp</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">
                Tại sao có dự án xếp hạng thấp nhưng vẫn sponsor?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sponsor là quyết định kinh doanh của chủ đầu tư, không liên quan đến chất lượng dự án.
                Một số dự án xếp hạng thấp vẫn có nhu cầu tiếp cận người dùng, và điều này hoàn toàn hợp lệ
                miễn là thông tin được công khai.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Làm sao biết thông tin đánh giá không bị sponsor chi phối?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Mọi nguồn tham khảo đều được liệt kê trong phần &ldquo;Nguồn tham khảo&rdquo; của mỗi dự án.
                Bạn có thể tự kiểm chứng thông tin từ các nguồn này.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Contact for sponsorship */}
        <GlassCard className="p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Liên hệ hợp tác</h2>
          <p className="text-muted-foreground">
            Nếu bạn là chủ đầu tư và muốn tìm hiểu về chương trình sponsor, vui lòng liên hệ:{" "}
            <span className="font-medium text-foreground">contact@lethanhdanh.id.vn</span>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
