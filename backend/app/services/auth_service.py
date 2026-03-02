from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from app.core.config import settings


class AuthService:
    @staticmethod
    async def register(user_data: UserCreate) -> TokenResponse:
        # Check if email exists
        existing_email = await User.find_one(User.email == user_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Check if username exists
        existing_username = await User.find_one(User.username == user_data.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=get_password_hash(user_data.password)
        )
        await user.insert()

        token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                username=user.username,
                is_active=user.is_active,
                created_at=user.created_at
            )
        )

    @staticmethod
    async def login(user_data: UserLogin) -> TokenResponse:
        user = await User.find_one(User.email == user_data.email)
        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive"
            )

        token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        return TokenResponse(
            access_token=token,
            user=UserResponse(
                id=str(user.id),
                email=user.email,
                username=user.username,
                is_active=user.is_active,
                created_at=user.created_at
            )
        )
