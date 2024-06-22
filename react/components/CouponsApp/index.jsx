import React, { useState, useEffect } from 'react'
import {
    Layout,
    PageBlock,
    PageHeader,
    Button,
    Input,
    ToastProvider,
    ToastConsumer,
} from 'vtex.styleguide'

const DISCOUNT_HASH =
    '2d33298f576f7df98f4d910567bcc9717a38bfb22e414139e1c7712de6776a82'

const CouponsApp = () => {
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [onePayDiscount, setOnePayDiscount] = useState(0)

    const links = [
        {
            name: 'Google',
            link: 'https://tiendasdigitalesar.myvtex.com/_v/xml/google',
        },
        {
            name: 'Facebook',
            link: 'https://tiendasdigitalesar.myvtex.com/_v/xml/facebook',
        },
        {
            name: 'Email Marketing',
            link: 'https://tiendasdigitalesar.myvtex.com/_v/xml/emailmarketing',
        },
    ]

    useEffect(() => {
        setLoading(() => true)
        fetch('/_v/discounts')
            .then((r) => r.json())
            .then((res) => {
                setOnePayDiscount(res.onePayDiscount)
            })
            .catch((e) => {
                console.warn('Error fetching Discounts API', e)
            })
            .finally(() => {
                setLoading(() => false)
            })
    }, [])

    const clipboard = (data, toast) => {
        // Create a fake element to receive data-code value
        const fake = document.createElement('textarea')

        fake.setAttribute('readonly', '')
        fake.value = data
        fake.style.position = 'fixed'
        fake.style.left = '-9999px'
        fake.style.top = `${window.pageYOffset || document.documentElement.scrollTop
            }px`
        document.body.appendChild(fake)
        // Set its focus and select its value
        fake.focus()
        fake.setSelectionRange(0, fake.value.length)
        // Copy to clipboard
        document.execCommand('copy')
        // Remove the element
        document.body.removeChild(fake)

        toast('Link copiado!')
    }

    const handleSaveOnePayDiscount = async () => {
        setSuccessMessage(() => '')
        try {
            await fetch('/_v/discounts', {
                method: 'POST',
                body: JSON.stringify({
                    secret: DISCOUNT_HASH,
                    onepaydiscount: onePayDiscount,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            setSuccessMessage('Descuento modificado correctamente')
        } catch (e) {
            console.warn('Discounts API Error', e)
            setSuccessMessage('Error modificando descuento')
        }
    }

    const handleOnePayInput = (e) => {
        const { value } = e.target

        setOnePayDiscount(parseInt(value, 10))
    }

    return (
        <ToastProvider positioning="window">
            <Layout>
                <PageHeader title="Custom XML" />
                <PageBlock>
                    <ToastConsumer>
                        {({ showToast }) => (
                            <div className="w-100 db">
                                <strong>Configuración</strong>
                                <div className="mv5 flex w-100 justify-between items-center">
                                    <div className="w-30">Descuento 1 Pago</div>
                                    <div className="w-100 mh6">
                                        {!loading && (
                                            <Input
                                                className="w-100"
                                                onChange={handleOnePayInput}
                                                value={onePayDiscount}
                                                type="number"
                                            />
                                        )}
                                        {successMessage !== '' && <span>{successMessage}</span>}
                                    </div>
                                    <div>
                                        <Button onClick={handleSaveOnePayDiscount}>Guardar</Button>
                                    </div>
                                </div>
                                <strong className="mt6" style={{ display: 'block' }}>
                                    URLs
                                </strong>
                                <div className="w-100 db">
                                    {links &&
                                        links.map((link) => (
                                            <div
                                                key={link.name}
                                                className="mv5 flex w-100 justify-between items-center"
                                            >
                                                <div className="w-30">{link.name}</div>
                                                <div className="w-100 mh6">
                                                    <Input
                                                        className="w-100"
                                                        value={link.link}
                                                        type="text"
                                                    />
                                                </div>
                                                <div>
                                                    <Button
                                                        onClick={() => clipboard(link.link, showToast)}
                                                    >
                                                        Copiar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </ToastConsumer>
                </PageBlock>
            </Layout>
        </ToastProvider>
    )
}

export default CouponsApp
