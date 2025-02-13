using System.Runtime.Serialization;

namespace StockManager.Models
{
    public enum Warehouse
    {
        [EnumMember(Value = "Regular Storage")]
        RegularStorage,

        [EnumMember(Value = "Refrigerated Section")]
        RefrigeratedSection,

        [EnumMember(Value = "Freezer Section")]
        FreezerSection,

        [EnumMember(Value = "Outdoor Storage")]
        OutdoorStorage
    }
}