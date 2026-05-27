from ninja import Router, Schema
from ninja.errors import HttpError

from .auth import auth, authenticate_user, create_auth_token

router = Router(tags=["auth"])


class LoginIn(Schema):
    username: str
    password: str


class UserOut(Schema):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    is_staff: bool


class LoginOut(Schema):
    token: str
    token_type: str = "Bearer"
    user: UserOut


class LogoutOut(Schema):
    ok: bool


@router.post("/login", response=LoginOut)
def login(request, payload: LoginIn):
    user = authenticate_user(payload.username, payload.password)
    if user is None:
        raise HttpError(401, "Usuário ou senha inválidos.")

    return LoginOut(token=create_auth_token(user), user=user)


@router.get("/me", auth=auth, response=UserOut)
def me(request):
    return request.auth


@router.post("/logout", auth=auth, response=LogoutOut)
def logout(request):
    return LogoutOut(ok=True)
