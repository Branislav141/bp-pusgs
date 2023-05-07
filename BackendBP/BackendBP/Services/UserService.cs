using AutoMapper;
using BackendBP.Data;
using BackendBP.Dto;
using BackendBP.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace BackendBP.Services
{
    public class UserService :IUserService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public UserService(IMapper mapper, DataContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public List<UserDto> GetUsers()
        {
            return _mapper.Map<List<UserDto>>(_dbContext.Users.ToListAsync());
        }

    }
}
