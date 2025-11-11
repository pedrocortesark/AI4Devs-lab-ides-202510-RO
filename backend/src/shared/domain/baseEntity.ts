export abstract class BaseEntity
{
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(id: string, createdAt?: Date, updatedAt?: Date)
    {
        this.id = id;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    public equals(entity: BaseEntity): boolean
    {
        if (!(entity instanceof BaseEntity))
        {
            return false;
        }
        return this.id === entity.id;
    }
}
