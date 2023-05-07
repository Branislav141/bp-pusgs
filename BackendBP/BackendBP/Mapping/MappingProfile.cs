using AutoMapper;
using BackendBP.Dto;
using BackendBP.Migrations;

namespace BackendBP.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
        }
    }
}
