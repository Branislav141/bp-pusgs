using BackendBP.Dto;
using System.Collections.Generic;

namespace BackendBP.Interfaces
{
    public interface IUserService
    {
        List<UserDto> GetUsers();
    }
}
