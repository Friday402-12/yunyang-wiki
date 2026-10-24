"""生成分享卡片 docs/public/og.png（1200x630）。

改完配色或文案后跑一次即可：
    python tools/make-og.py

依赖 Pillow（`pip install pillow`）。没有 Pillow 也不影响网站运行，
og.png 已经提交在仓库里，直接改图片也一样。
"""

import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "public", "og.png")

W, H = 1200, 630

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\msyhbd.ttc",
    r"C:\Windows\Fonts\NotoSansSC-VF.ttf",
    r"C:\Windows\Fonts\simhei.ttf",
    "/System/Library/Fonts/PingFang.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size, index=0)
            except Exception:
                continue
    raise RuntimeError("找不到可用的中文字体，请把字体路径加进 FONT_CANDIDATES")


# 竖向渐变：上浅下深，配色沿用站点主色 #8C1F28
top, bottom = (163, 41, 52), (94, 18, 26)
img = Image.new("RGB", (W, H), top)
px = img.load()
for y in range(H):
    t = y / (H - 1)
    row = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    for x in range(W):
        px[x, y] = row

# 右上角「日」+ 远处山影，呼应 logo 的山 + 日
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
od.ellipse([840, 44, 1072, 276], fill=(255, 255, 255, 16))
od.ellipse([888, 92, 1024, 228], fill=(255, 236, 213, 40))
od.polygon([(520, 630), (800, 392), (1010, 630)], fill=(0, 0, 0, 30))
od.polygon([(730, 630), (960, 430), (1200, 630)], fill=(0, 0, 0, 40))
img = Image.alpha_composite(img.convert("RGBA"), overlay)

d = ImageDraw.Draw(img)
f_title = load_font(118)
f_text = load_font(54)
f_small = load_font(27)
f_latin = load_font(78)

d.rectangle([84, 176, 96, 388], fill=(255, 226, 206))

d.text((128, 158), "郧中", font=f_title, fill=(255, 255, 255))
zh_w = d.textlength("郧中", font=f_title)
d.text((128 + zh_w + 16, 186), "Wiki", font=f_latin, fill=(255, 255, 255))

d.text((132, 310), "在郧中，少走弯路", font=f_text, fill=(255, 219, 208))

d.line([(132, 424), (1068, 424)], fill=(212, 132, 138), width=2)

d.text((132, 454), "十堰市郧阳中学 · 学生共建的校园知识库", font=f_small, fill=(246, 205, 200))
d.text((132, 500), "食堂 / 宿舍 / 选科 / 高考 / 社团，一次说清", font=f_small, fill=(214, 150, 152))

img.convert("RGB").save(OUT, "PNG", optimize=True)
print("saved", OUT, img.size, os.path.getsize(OUT) // 1024, "KB")
