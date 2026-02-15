from sqlalchemy.orm import Session
from app.models.user import User
from app.models.news import News
from app.models.case import Case
from app.models.company import Company
from app.models.service import Service
from app.core.security import get_password_hash


def init_db_data(db: Session) -> None:
    user = db.query(User).first()
    if not user:
        admin_user = User(
            username="admin",
            email="admin@yiran-huanxin.com",
            hashed_password=get_password_hash("admin123"),
            is_superuser=True,
            is_active=True,
        )
        db.add(admin_user)

        demo_news = [
            News(
                title="三棵树涂料荣获2024年度环保涂料十大品牌",
                summary="三棵树涂料凭借卓越的环保性能和品质，再次荣获年度环保涂料十大品牌称号。",
                content="三棵树涂料凭借卓越的环保性能和品质，再次荣获年度环保涂料十大品牌称号。这是三棵树连续第五年获得此殊荣，充分体现了品牌在环保涂料领域的领先地位。",
                category="行业动态",
                is_published=True,
                view_count=1256,
            ),
            News(
                title="宜然焕新完成福州某大型商业综合体焕新项目",
                summary="近日，我司成功完成福州某大型商业综合体的整体焕新项目，获得业主高度评价。",
                content="近日，我司成功完成福州某大型商业综合体的整体焕新项目，项目面积超过5000平方米，施工周期仅用15天，获得业主高度评价。",
                category="公司新闻",
                is_published=True,
                view_count=892,
            ),
            News(
                title="墙面翻新需要注意的五个要点",
                summary="墙面翻新看似简单，但其中有很多细节需要注意。本文为您详细介绍墙面翻新的五个关键要点。",
                content="墙面翻新需要注意的五个要点：\n\n1. 基层处理要到位\n2. 选择环保材料\n3. 注意施工环境\n4. 颜色搭配要协调\n5. 选择专业施工团队",
                category="装修知识",
                is_published=True,
                view_count=2341,
            ),
        ]
        for news in demo_news:
            db.add(news)

        demo_cases = [
            Case(
                title="福州某小区全屋翻新",
                description="120平米三居室全屋墙面翻新，采用三棵树净味墙面漆，施工周期3天，业主当天入住。",
                location="福州市鼓楼区",
                service_type="墙面翻新",
                area="120㎡",
                is_featured=1,
            ),
            Case(
                title="厦门办公室焕新改造",
                description="200平米办公空间整体焕新，包含墙面、吊顶、地面处理，周末施工不影响正常办公。",
                location="厦门市思明区",
                service_type="商业空间",
                area="200㎡",
                is_featured=1,
            ),
            Case(
                title="泉州老房整体改造",
                description="80平米老房整体改造，水电改造、厨卫翻新、墙面处理一站式服务，焕然一新。",
                location="泉州市丰泽区",
                service_type="旧房改造",
                area="80㎡",
                is_featured=1,
            ),
            Case(
                title="漳州别墅外墙翻新",
                description="独栋别墅外墙全面翻新，防水处理加环保外墙漆，美观耐用。",
                location="漳州市龙文区",
                service_type="墙面翻新",
                area="300㎡",
                is_featured=0,
            ),
        ]
        for case in demo_cases:
            db.add(case)

        demo_services = [
            Service(
                name="墙面翻新",
                slug="wall-renovation",
                description="专业墙面翻新服务，采用三棵树环保涂料，无毒无味，即刷即住。适用于家庭住宅、办公室、商业空间等各类场所。",
                icon="paintbrush",
                features=["环保材料", "快速施工", "质保5年", "免费上门量房"],
                price_range="15-35元/㎡",
                duration="1-3天",
                is_featured=True,
                sort_order=1,
            ),
            Service(
                name="旧房改造",
                slug="old-house-renovation",
                description="一站式旧房改造服务，涵盖水电改造、厨卫翻新、墙面处理等，让老房焕发新生。",
                icon="home",
                features=["整体规划", "水电改造", "厨卫翻新", "软装搭配"],
                price_range="200-500元/㎡",
                duration="7-15天",
                is_featured=True,
                sort_order=2,
            ),
            Service(
                name="商业空间",
                slug="commercial-space",
                description="专业商业空间焕新服务，周末施工不影响营业，快速提升品牌形象。",
                icon="building",
                features=["夜间施工", "快速交付", "品牌定制", "一站式服务"],
                price_range="20-50元/㎡",
                duration="2-5天",
                is_featured=True,
                sort_order=3,
            ),
            Service(
                name="外墙翻新",
                slug="exterior-renovation",
                description="外墙翻新服务，防水防霉，耐候性强，提升建筑外观和使用寿命。",
                icon="sun",
                features=["防水处理", "耐候涂层", "高空作业", "质保10年"],
                price_range="30-60元/㎡",
                duration="3-7天",
                is_featured=False,
                sort_order=4,
            ),
            Service(
                name="定制服务",
                slug="custom-service",
                description="根据您的需求提供个性化定制服务，专业团队全程跟进，确保满意。",
                icon="settings",
                features=["个性定制", "专业设计", "全程跟进", "售后保障"],
                price_range="面议",
                duration="视情况而定",
                is_featured=False,
                sort_order=5,
            ),
        ]
        for service in demo_services:
            db.add(service)

    company = db.query(Company).first()
    if not company:
        company = Company(
            name="福建省宜然焕新科技有限公司",
            phone="400-888-8888",
            email="contact@yiran-huanxin.com",
            address="福建省福州市鼓楼区",
            copyright_text="© 2024 福建省宜然焕新科技有限公司 版权所有",
        )
        db.add(company)

    db.commit()
    print("Database initialized with demo data")
