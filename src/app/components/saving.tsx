import { FieldValues, useFormContext } from "react-hook-form";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from "react";
import throttle from "lodash/throttle";
import { useEventQueueContext } from "@/event-queue";

const WAIT_DURATION = 800;


type SavingTypes = {
    onSubmit: (data: FieldValues) => void,
    setLoading: (flag: boolean) => void,
    loading: boolean;
}

export default function Saver({ onSubmit, loading, setLoading }: SavingTypes): React.ReactNode {
    const onQueue = useEventQueueContext();
    const methods = useFormContext();
    const { getValues, watch } = methods;

    const handleAutoSave = async () => {
        onQueue?.(
            () =>
                new Promise(async (resolve) => {
                    setLoading(true);
                    await onSubmit(getValues());
                    resolve(getValues());
                })
        );
    };

    const throttledSave = React.useCallback(
        throttle(() => {
            handleAutoSave();
        }, WAIT_DURATION, { leading: false, trailing: true }),
        [throttle, handleAutoSave]
    );

    React.useEffect(() => {
        const subscription = watch((_, { type }) => {
            if (type === "change") {
                return throttledSave();
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    if (loading) {
        return (
            <Box style={{ position: 'absolute', left: '-50px', top: 0 }}><CircularProgress /></Box>
        )
    }

    return <></>;
}
