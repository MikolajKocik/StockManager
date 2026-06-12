using AutoMapper;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Core.Domain.Models.MaintenanceAssetEntity;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Application.Mappings.MaintenanceProfile;

public class MaintenanceMappingProfile : Profile
{
    public MaintenanceMappingProfile()
    {
        CreateMap<MaintenanceAsset, MaintenanceAssetDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.BinLocationCode, opt => opt.MapFrom(src => src.BinLocation != null ? src.BinLocation.Code : null));

        CreateMap<MaintenanceIncident, MaintenanceIncidentDto>()
            .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.ReportedByName, opt => opt.MapFrom(src => src.ReportedBy != null ? src.ReportedBy.UserName : null))
            .ForMember(dest => dest.AssignedToName, opt => opt.MapFrom(src => src.AssignedTo != null ? src.AssignedTo.UserName : null))
            .ForMember(dest => dest.AssetName, opt => opt.MapFrom(src => src.Asset != null ? src.Asset.Name : null))
            .ForMember(dest => dest.BinLocationCode, opt => opt.MapFrom(src => src.BinLocation != null ? src.BinLocation.Code : null));
    }
}
