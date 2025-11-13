import React from 'react';
import TextInput from './TextInput';
import DateInput from './DateInput';
import './DynamicFields.css';

interface EducationFieldsProps
{
    fields: any[];
    register: any;
    errors: any;
    append: (value: any) => void;
    remove: (index: number) => void;
}

const EducationFields: React.FC<EducationFieldsProps> = ({
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
                <h2 className="section-title">Educación</h2>
                <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => append({
                        institution: '',
                        degree: '',
                        fieldOfStudy: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                    })}
                >
                    + Añadir Educación
                </button>
            </div>

            {fields.length === 0 && (
                <p className="empty-state">No hay registros de educación. Haz clic en "Añadir Educación" para comenzar.</p>
            )}

            {fields.map((field, index) => (
                <div key={field.id} className="dynamic-item">
                    <div className="item-header">
                        <h3 className="item-title">Educación #{index + 1}</h3>
                        <button
                            type="button"
                            className="btn-remove"
                            onClick={() => remove(index)}
                            aria-label="Eliminar educación"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="form-row">
                        <TextInput
                            label="Institución"
                            name={`educations.${index}.institution`}
                            placeholder="Universidad Complutense de Madrid"
                            register={register(`educations.${index}.institution`)}
                            error={errors.educations?.[index]?.institution?.message}
                            required
                        />

                        <TextInput
                            label="Título"
                            name={`educations.${index}.degree`}
                            placeholder="Grado en Ingeniería Informática"
                            register={register(`educations.${index}.degree`)}
                            error={errors.educations?.[index]?.degree?.message}
                            required
                        />
                    </div>

                    <TextInput
                        label="Campo de Estudio"
                        name={`educations.${index}.fieldOfStudy`}
                        placeholder="Ciencias de la Computación"
                        register={register(`educations.${index}.fieldOfStudy`)}
                        error={errors.educations?.[index]?.fieldOfStudy?.message}
                    />

                    <div className="form-row">
                        <DateInput
                            label="Fecha de Inicio"
                            name={`educations.${index}.startDate`}
                            register={register(`educations.${index}.startDate`)}
                            error={errors.educations?.[index]?.startDate?.message}
                            required
                        />

                        <DateInput
                            label="Fecha de Fin"
                            name={`educations.${index}.endDate`}
                            register={register(`educations.${index}.endDate`)}
                            error={errors.educations?.[index]?.endDate?.message}
                        />
                    </div>

                    <div className="checkbox-field">
                        <input
                            id={`educations.${index}.current`}
                            type="checkbox"
                            className="form-checkbox"
                            {...register(`educations.${index}.current`)}
                        />
                        <label htmlFor={`educations.${index}.current`} className="checkbox-label">
                            Estudio actualmente aquí
                        </label>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EducationFields;
