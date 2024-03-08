import {
    Any,
    ArrayContainedBy,
    ArrayContains,
    ArrayOverlap,
    Between,
    Equal,
    ILike,
    Like,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
    Not,

} from "typeorm"


export const FILTER_MAPPER = {
    any: Any,
    array_contained_by: ArrayContainedBy,
    array_contains: ArrayContains,
    array_overlap: ArrayOverlap,
    between: Between,
    equal: Equal,
    i_like: ILike,
    like: Like,
    in: In,
    is_null: IsNull,
    less_than: LessThan,
    less_than_or_equal: LessThanOrEqual,
    more_than: MoreThan,
    more_than_or_equal: MoreThanOrEqual,
    not: Not

}