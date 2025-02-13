using System.Runtime.Serialization;

namespace StockManager.Models
{
    public enum Genre
    {
        [EnumMember(Value = "Vegetables")]
        Vegetables,

        [EnumMember(Value = "Fruits")]
        Fruits,

        [EnumMember(Value = "Dairy")]
        Dairy,

        [EnumMember(Value = "Meat")]
        Meat,

        [EnumMember(Value = "Fish")]
        Fish,

        [EnumMember(Value = "DryProducts")]
        DryProducts,

        [EnumMember(Value = "FrozenProducts")]
        FrozenProducts
    }
}
