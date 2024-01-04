import { Box, Button, Typography } from "@mui/material";
import { EventQueueProvider, useEventQueue } from "@/event-queue";
import { FieldValues, FormProvider, useForm } from "react-hook-form";

import { FormInputText } from "./formInputText";
import React from 'react';
import Saving from "./saving";

type IFormInput = {
    name: string;
    comment: string;
};

const defaultValues = {
    name: "",
    comment: "",
};

export const FormDemo = () => {
    const methods = useForm<IFormInput>({
        defaultValues: defaultValues,
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const onQueue = useEventQueue();
    const { handleSubmit, control, getValues } = methods;

    const onSubmit = async (data: FieldValues) => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(data)
        setLoading(false);
    };

    const handleSave = async () => {
        onQueue?.(
            () =>
                new Promise(async (resolve) => {
                    setLoading(true);
                    await onSubmit(getValues());
                    resolve();
                })
        );
    };

    return (
        <EventQueueProvider value={onQueue}>
            <FormProvider {...methods}>
                <Box
                    style={{
                        display: "grid",
                        gridRowGap: "20px",
                        padding: "20px",
                        margin: "100px",
                    }}
                >
                    <Typography variant="h4" style={{
                        position: 'relative'
                    }}>
                        <Saving onSubmit={onSubmit} loading={loading} setLoading={setLoading} />
                        Form Demo
                    </Typography>
                    <FormInputText name="name" control={control} label="Name" />
                    <FormInputText
                        minRows={12}
                        multiline
                        name="comment"
                        control={control}
                        label="Comment"
                    />
                    <Button onClick={handleSave} variant={"contained"}>
                        Submit
                    </Button>

                </Box>
            </FormProvider>
        </EventQueueProvider>
    );
};
