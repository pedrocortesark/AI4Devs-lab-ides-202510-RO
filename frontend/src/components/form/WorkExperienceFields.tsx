import React from 'react';
import TextInput from './TextInput';
import TextArea from './TextArea';
import DateInput from './DateInput';
import './DynamicFields.css';

interface WorkExperienceFieldsProps
{
    fields: any[];
    register: any;
    errors: any;
    append: (value: any) => void;
    remove: (index: number) => void;
}

const WorkExperienceFields: React.FC<WorkExperienceFieldsProps> = ({
    fields,
    register,
    errors,
    append,
    remove,
}) =>
{
    return (
        <div className="dynamic-section">
            <div className="section-header">
                <h2 className="section-title">Experiencia Laboral</h2>
                <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => append({
                        company: '',
                        position: '',
                        description: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                    })}
                >
                    + Añadir Experiencia
                </button>
            </div>

            {fields.length === 0 && (
                <p className="empty-state">No hay registros de experiencia laboral. Haz clic en "Añadir Experiencia" para comenzar.</p>
            )}

            {fields.map((field, index) => (
                <div key={field.id} className="dynamic-item">
                    <div className="item-header">
                        <h3 className="item-title">Experiencia #{index + 1}</h3>
                        <button
                            type="button"
                            className="btn-remove"
                            onClick={() => remove(index)}
                            aria-label="Eliminar experiencia"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="form-row">
                        <TextInput
                            label="Empresa"
                            name={`workExperiences.${index}.company`}
                            placeholder="Acme Corporation"
                            register={register(`workExperiences.${index}.company`)}
                            error={errors.workExperiences?.[index]?.company?.message}
                            required
                        />

                        <TextInput
                            label="Puesto"
                            name={`workExperiences.${index}.position`}
                            placeholder="Desarrollador Full Stack"
                            register={register(`workExperiences.${index}.position`)}
                            error={errors.workExperiences?.[index]?.position?.message}
                            required
                        />
                    </div>

                    <TextArea
                        label="Descripción"
                        name={`workExperiences.${index}.description`}
                        placeholder="Describe tus responsabilidades y logros..."
                        register={register(`workExperiences.${index}.description`)}
                        error={errors.workExperiences?.[index]?.description?.message}
                        rows={3}
                    />

                    <div className="form-row">
                        <DateInput
                            label="Fecha de Inicio"
                            name={`workExperiences.${index}.startDate`}
                            register={register(`workExperiences.${index}.startDate`)}
                            error={errors.workExperiences?.[index]?.startDate?.message}
                            required
                        />

                        <DateInput
                            label="Fecha de Fin"
                            name={`workExperiences.${index}.endDate`}
                            register={register(`workExperiences.${index}.endDate`)}
                            error={errors.workExperiences?.[index]?.endDate?.message}
                        />
                    </div>

                    <div className="checkbox-field">
                        <input
                            id={`workExperiences.${index}.current`}
                            type="checkbox"
                            className="form-checkbox"
                            {...register(`workExperiences.${index}.current`)}
                        />
                        <label htmlFor={`workExperiences.${index}.current`} className="checkbox-label">
                            Trabajo actualmente aquí
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WorkExperienceFields;
