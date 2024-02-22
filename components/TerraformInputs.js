import Typography from "@material-ui/core/Typography";

export default function TerraformInputs({name, type, description, defaultValue}) {
    return (
        <div>
            <div style={{display: 'flex', gap: 10}}>
                <Typography variant={"h6"}>
                    <b>{name}</b>
                </Typography>
                <Typography style={{
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    color: '#4a4a4a',
                    display: 'inline-flex',
                    height: '2em',
                    justifyContent: 'center',
                    lineHeight: '1.5',
                    paddingLeft: '0.75em',
                    paddingRight: '0.75em',
                    whiteSpace: 'nowrap'
                }}>
                    {type}
                </Typography>
            </div>
            <br/>
            <Typography variant={"caption"}>
                <code style={{
                    backgroundColor: '#f7f8fa',
                    border: '1px solid #dce0e6',
                    borderRadius: '2px',
                    fontWeight: '500',
                    fontSize: '12px',
                    color: '#C62A71',
                    textAlign: 'center',
                    padding: '4px',
                    height: '16px',
                    margin: '0 4px',
                }}>{description}</code>
            </Typography>
            {defaultValue &&
                <>
                    <br/>
                    <br/>
                    <Typography variant={"caption"}>
                        Default
                        <code style={{
                            backgroundColor: '#f7f8fa',
                            border: '1px solid #dce0e6',
                            borderRadius: '2px',
                            fontWeight: '500',
                            fontSize: '12px',
                            color: '#C62A71',
                            textAlign: 'center',
                            padding: '4px',
                            height: '16px',
                            margin: '0 4px',
                        }}>{defaultValue}</code>
                    </Typography>
                </>
            }
            <br/>
            <br/>
        </div>
    )
}