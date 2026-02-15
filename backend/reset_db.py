import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

import os as os_module

db_path = "data/yiran_huanxin.db"
if os_module.path.exists(db_path):
    os_module.remove(db_path)
    print(f"Deleted old database: {db_path}")

os_module.makedirs("data", exist_ok=True)
print("Created data directory")

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, init_db
from app.models.user import User
from app.models.news import News
from app.models.case import Case
from app.models.service import Service
from app.models.company import Company
from app.core.security import get_password_hash, verify_password

def create_admin():
    print("\nCreating database tables...")
    init_db()
    print("Tables created!")
    
    db: Session = SessionLocal()
    try:
        print("\nCreating admin user...")
        hashed_pw = get_password_hash("admin123")
        print(f"Hashed password created: {hashed_pw[:30]}...")
        
        admin_user = User(
            username="admin",
            email="admin@yiran-huanxin.com",
            hashed_password=hashed_pw,
            is_superuser=True,
            is_active=True,
        )
        db.add(admin_user)
        
        print("Adding demo news...")
        demo_news = [
            News(
                title="三棵树涂料荣获2024年度环保涂料十大品牌",
                summary="三棵树涂料凭借卓越的环保性能和品质，再次荣获年度环保涂料十大品牌称号。",
                content="详细内容...",
                category="行业动态",
                is_published=True,
                view_count=1256,
            ),
            News(
                title="宜然焕新完成福州某大型商业综合体焕新项目",
                summary="近日，我司成功完成福州某大型商业综合体的整体焕新项目。",
                content="详细内容...",
                category="公司新闻",
                is_published=True,
                view_count=892,
            ),
        ]
        for news in demo_news:
            db.add(news)
        
        print("Adding demo cases...")
        demo_cases = [
            Case(
                title="福州某小区全屋翻新",
                description="120平米三居室全屋墙面翻新",
                location="福州市鼓楼区",
                service_type="墙面翻新",
                area="120㎡",
                is_featured=1,
            ),
            Case(
                title="厦门办公室焕新改造",
                description="200平米办公空间整体焕新",
                location="厦门市思明区",
                service_type="商业空间",
                area="200㎡",
                is_featured=1,
            ),
        ]
        for case in demo_cases:
            db.add(case)
        
        print("Adding demo services...")
        demo_services = [
            Service(
                name="墙面翻新",
                slug="wall-renovation",
                description="专业墙面翻新服务，采用三棵树环保涂料，无毒无味，快速施工",
                icon="paintbrush",
                features=["墙面检测评估", "基层处理修复", "环保涂料施工", "完工清洁整理"],
                price_range="15-35元/㎡",
                duration="1-3天",
                is_featured=True,
                sort_order=1,
            ),
            Service(
                name="旧房改造",
                slug="old-house-renovation",
                description="一站式旧房改造服务，从设计到施工全程托管",
                icon="home",
                features=["整体方案设计", "水电改造升级", "厨卫翻新改造", "软装搭配建议"],
                price_range="200-500元/㎡",
                duration="7-30天",
                is_featured=True,
                sort_order=2,
            ),
            Service(
                name="商业空间",
                slug="commercial-space",
                description="商业空间焕新服务，不影响正常营业",
                icon="building",
                features=["营业时间施工", "快速完工交付", "专业设计方案", "售后维护保障"],
                price_range="30-80元/㎡",
                duration="2-7天",
                is_featured=True,
                sort_order=3,
            ),
            Service(
                name="定制服务",
                slug="custom-service",
                description="根据您的需求提供个性化定制服务",
                icon="settings",
                features=["专属方案定制", "材料品牌可选", "施工周期灵活", "全程管家服务"],
                price_range="面议",
                duration="根据项目",
                is_featured=False,
                sort_order=4,
            ),
        ]
        for service in demo_services:
            db.add(service)
        
        print("Adding company info...")
        company_info = Company(
            name="福建省宜然焕新科技有限公司",
            short_name="宜然焕新",
            description="专业墙面翻新、旧房改造服务商，使用三棵树环保涂料，让您当天入住",
            address="福建省福州市鼓楼区软件大道89号",
            phone="400-888-8888",
            email="service@yiran-huanxin.com",
            wechat="yiran-huanxin",
            business_hours="周一至周日 8:00-20:00",
            icp="闽ICP备XXXXXXXX号",
        )
        db.add(company_info)
        
        db.commit()
        print("\nDatabase initialized successfully!")
        
        admin = db.query(User).filter(User.username == "admin").first()
        if admin:
            print(f"\nAdmin user verified:")
            print(f"  ID: {admin.id}")
            print(f"  Username: {admin.username}")
            result = verify_password("admin123", admin.hashed_password)
            print(f"  Password test: {result}")
        
        print("\n" + "=" * 50)
        print("  Login credentials:")
        print("  Username: admin")
        print("  Password: admin123")
        print("=" * 50)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
