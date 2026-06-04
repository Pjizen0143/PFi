from sqlmodel import Session, select
from app.models.category import Category

class CategoryRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def add(self, category: Category) -> None:
        self.session.add(category)

    def get_by_code(self, category_code: str) -> Category | None:
        statement = select(Category).where(Category.code == category_code)
        return self.session.exec(statement).first()

    def list_all(self) -> list[Category]:
        statement = select(Category)
        return list(self.session.exec(statement).all())

    def delete(self, category: Category) -> None:
        self.session.delete(category)
